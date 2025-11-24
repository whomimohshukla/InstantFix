import redis from "../config/redis";
import { withinRateLimit } from "./rateLimit";
import { plivoClient, plivoFrom } from "../config/plivo";
import { userRepo } from "../repositories/user.repo";
import jwt from "jsonwebtoken";

const OTP_TTL_SECONDS = 5 * 60; // 5 minutes
const RESEND_LIMIT = 5; // per hour

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
  await plivoClient.messages.create(
    plivoFrom,
    phone,
    `Your InstantFix OTP is ${otp}. Valid for 5 minutes.`
  );
}

export async function issuePhoneOTP(phone: string) {
  // Only allow for existing users (phone-login). Adjust if you want phone signup.
  const user = await userRepo.findByPhone(phone);
  if (!user)
    return { ok: false, status: 404, message: "Phone not registered" } as const;

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

export async function resendPhoneOTP(phone: string) {
  const allowed = await withinRateLimit(rlKey(phone), RESEND_LIMIT, 3600);
  if (!allowed)
    return { ok: false, status: 429, message: "Too many requests" } as const;
  return issuePhoneOTP(phone);
}
