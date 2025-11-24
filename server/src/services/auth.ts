import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userRepo } from "../repositories/user.repo";
import { prisma } from "../lib/prisma";
import transporter, { mailFrom } from "../config/mailer";
import {
  issueOTP,
  verifyOTP as verifyOtpSvc,
  resendOTP as resendOtpSvc,
} from "./otp.service";

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export async function signup({
  email,
  password,
  name,
  phone,
  role,
}: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  role?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}) {
  const emailNorm = email.trim().toLowerCase();
  const phoneNorm = phone && phone.trim() ? phone.trim() : null;

  const existing = await userRepo.findByEmail(emailNorm);
  if (existing)
    return { ok: false, status: 409, message: "Email already registered" };

  // Prevent public signup as ADMIN unless explicitly allowed via env toggle
  if (role === "ADMIN" && process.env.ALLOW_ADMIN_SIGNUP !== "1") {
    return { ok: false, status: 400, message: "Admin signup disabled" };
  }

  if (phoneNorm) {
    const existingPhone = await userRepo.findByPhone(phoneNorm);
    if (existingPhone)
      return { ok: false, status: 409, message: "Phone already registered" };
  }

  const passwordHash = await hashPassword(password);
  let user;
  try {
    user = await userRepo.create({
      email: emailNorm,
      passwordHash,
      name: name || null,
      phone: phoneNorm,
      role: role || "CUSTOMER",
    });
  } catch (e: any) {
    // Handle unique constraint edge cases
    const target = e?.meta?.target as string[] | string | undefined;
    const targetStr = Array.isArray(target) ? target.join(",") : target;
    if (e?.code === "P2002" && targetStr?.includes("phone")) {
      return { ok: false, status: 409, message: "Phone already registered" };
    }
    if (e?.code === "P2002" && targetStr?.includes("email")) {
      return { ok: false, status: 409, message: "Email already registered" };
    }
    throw e;
  }

  // Create role-specific profile
  try {
    if ((role || "CUSTOMER") === "CUSTOMER") {
      await userRepo.createCustomerProfile(user.id);
    } else if (role === "TECHNICIAN") {
      await userRepo.createTechnicianProfile(user.id);
    }
  } catch {
    // ignore if profile already exists or fails; not critical for signup
  }

  await issueOTP(email);
  return {
    ok: true,
    status: 201,
    message: "Signup successful. Check email for OTP.",
  };
}

export async function verifyOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const result = await verifyOtpSvc(email, otp);
  if (!result.ok) {
    if ((result as any).reason === "expired_or_missing") {
      return { ok: false, status: 400, message: "OTP expired or not found" };
    }
    return { ok: false, status: 400, message: "Invalid OTP" };
  }
  await userRepo.markEmailVerified(email);
  return { ok: true, status: 200, message: "Email verified" };
}

export async function resendOtp({ email }: { email: string }) {
  const rs = await resendOtpSvc(email);
  if (!rs.ok)
    return { ok: false, status: 429, message: "Too many requests. Try later." };
  return { ok: true, status: 200, message: "OTP resent" };
}

export async function login({
  email,
  password,
  role,
  ip,
  userAgent,
}: {
  email: string;
  password: string;
  role?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  ip?: string | null;
  userAgent?: string | null;
}) {
  const user = await userRepo.findByEmail(email);
  if (!user) return { ok: false, status: 401, message: "Invalid credentials" };

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return { ok: false, status: 401, message: "Invalid credentials" };

  if (role && user.role !== role) {
    return { ok: false, status: 403, message: "Role not permitted" };
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) return { ok: false, status: 500, message: "JWT secret missing" };

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    secret,
    {
      expiresIn: "7d",
    }
  );

  // Fire-and-forget: record login activity and notify via email
  const when = new Date();
  try {
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        ip: ip || null,
        userAgent: userAgent || null,
        createdAt: when,
      },
    });
  } catch {}

  try {
    const appName = process.env.APP_NAME || "InstantFix";
    const subject = `New ${appName} login`;
    const text = `A new login to your ${appName} account was detected.\n\nTime: ${when.toISOString()}\nIP: ${ip || "unknown"}\nDevice: ${userAgent || "unknown"}\n\nIf this wasn't you, please reset your password.`;
    const html = `
      <div style="background:#f6f8fb;padding:24px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #f1f5f9;">
              <div style="font-size:16px;font-weight:600;color:#111827;">${appName}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <h1 style="margin:0 0 8px 0;font-size:18px;color:#111827;">New login detected</h1>
              <p style="margin:0 0 8px 0;font-size:14px;color:#334155;">We noticed a login to your account.</p>
              <ul style="margin:8px 0 16px 20px;padding:0;font-size:14px;color:#334155;">
                <li><b>Time:</b> ${when.toISOString()}</li>
                <li><b>IP:</b> ${ip || "unknown"}</li>
                <li><b>Device:</b> ${userAgent || "unknown"}</li>
              </ul>
              <p style="margin:0;font-size:12px;color:#64748b;">If this wasn’t you, please reset your password immediately.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 24px;background:#f8fafc;border-top:1px solid #f1f5f9;font-size:12px;color:#64748b;">© ${when.getFullYear()} ${appName}</td>
          </tr>
        </table>
      </div>`;
    await transporter.sendMail({ from: mailFrom, to: user.email, subject, text, html });
  } catch {}

  return { ok: true, status: 200, token, data: user };
}
