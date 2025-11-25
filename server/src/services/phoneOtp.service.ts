import redis from "../config/redis";
import { withinRateLimit } from "./rateLimit";
import { plivoClient, plivoFrom } from "../config/plivo";
import { userRepo } from "../repositories/user.repo";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const RESEND_LIMIT = 5; // per hour
const APP_NAME = process.env.APP_NAME || "InstantFix";
const OTP_MINUTES = Math.floor(OTP_TTL_SECONDS / 60);

function otpKey(phone: string) {
  return `otp:sms:${phone}`;
}
function rlKey(phone: string) {
  return `otp:sms:resend:${phone}`;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSmsOTP(phone: string, otp: string) {
  // Allow disabling real SMS in local/dev via env toggle
  if (process.env.SMS_DISABLED === "1") {
    console.log(`[DEV SMS] To ${phone}: ${otp}`);
    return;
  }
  console.log("code ", otp);
  await plivoClient.messages.create(
    plivoFrom,
    phone,
    `${APP_NAME} code: ${otp}. Expires in ${OTP_MINUTES}m. Do not share this code.`
  );
}

export async function issuePhoneOTP(phone: string) {
  // Only allow for existing users (phone-login). Adjust if you want phone signup.
  const user = await userRepo.findByPhone(phone);
  if (!user)
    return { ok: false, status: 404, message: "Phone not registered" } as const;

  // Restrict phone-only login to CUSTOMER accounts
  if (user.role !== "CUSTOMER") {
    return {
      ok: false,
      status: 403,
      message: "Phone login allowed only for customers",
    } as const;
  }

  const otp = generateOTP();
  await redis.set(otpKey(phone), otp, "EX", OTP_TTL_SECONDS);
  await sendSmsOTP(phone, otp);
  return { ok: true, status: 200, message: "OTP sent" } as const;
}

export async function verifyPhoneOTP(phone: string, otp: string) {
  const stored = await redis.get(otpKey(phone));
  if (!stored)
    return {
      ok: false,
      status: 400,
      message: "OTP expired or missing",
    } as const;
  if (stored !== otp)
    return { ok: false, status: 400, message: "Invalid OTP" } as const;

  await redis.del(otpKey(phone));

  const user = await userRepo.findByPhone(phone);
  if (!user)
    return { ok: false, status: 404, message: "Account not found" } as const;

  // Extra safety: ensure only CUSTOMER can complete phone login
  if (user.role !== "CUSTOMER") {
    return {
      ok: false,
      status: 403,
      message: "Phone login allowed only for customers",
    } as const;
  }

  // Mark phone verified in DB
  try {
    await userRepo.markPhoneVerified(phone);
  } catch {}

  const secret = process.env.JWT_SECRET;
  if (!secret)
    return { ok: false, status: 500, message: "JWT secret missing" } as const;

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
  return { ok: true, status: 200, token, data: user } as const;
}

// Customer phone-only signup helper
export async function customerPhoneSignup(phone: string, name?: string) {
  const phoneNorm = phone.trim();

  // If already registered, just reuse login flow (send OTP)
  const existing = await userRepo.findByPhone(phoneNorm);
  if (existing) {
    // Ensure it's a customer for phone login
    if (existing.role !== "CUSTOMER") {
      return {
        ok: false,
        status: 403,
        message: "Phone login allowed only for customers",
      } as const;
    }
    return issuePhoneOTP(phoneNorm);
  }

  // Create a new CUSTOMER with synthetic email & random password
  const digits = phoneNorm.replace(/[^0-9]/g, "") || "phone";
  let syntheticEmail = `${digits}@phone.instantfix.internal`;

  // Best effort: avoid email collision
  const emailExists = await userRepo.existsByEmail(syntheticEmail);
  if (emailExists) {
    syntheticEmail = `${digits}+${Date.now()}@phone.instantfix.internal`;
  }

  const randomPassword = `P!${Math.random()
    .toString(36)
    .slice(2)}${Date.now()}`;
  const passwordHash = await bcrypt.hash(randomPassword, 10);

  const user = await userRepo.create({
    email: syntheticEmail,
    passwordHash,
    name: name || null,
    phone: phoneNorm,
    role: "CUSTOMER",
  });

  try {
    await userRepo.createCustomerProfile(user.id);
  } catch {}

  return issuePhoneOTP(phoneNorm);
}

export async function resendPhoneOTP(phone: string) {
  const allowed = await withinRateLimit(rlKey(phone), RESEND_LIMIT, 3600);
  if (!allowed)
    return { ok: false, status: 429, message: "Too many requests" } as const;
  return issuePhoneOTP(phone);
}
