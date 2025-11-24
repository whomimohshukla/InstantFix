import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userRepo } from "../repositories/user.repo";
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

  // Prevent public signup as ADMIN
  if (role === "ADMIN") {
    return { ok: false, status: 400, message: "Invalid role for signup" };
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
}: {
  email: string;
  password: string;
  role?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
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
  return { ok: true, status: 200, token, data: user };
}
