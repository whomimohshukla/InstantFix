import redis from "../config/redis";
import transporter, { mailFrom } from "../config/mailer";
// import { generateOTP } from "../utils/otp.js";
import { withinRateLimit } from "./rateLimit";

const OTP_TTL_SECONDS = 600; // 10 minutes
const RESEND_LIMIT = 10; // per hour
const APP_NAME = process.env.APP_NAME || "InstantFix";
const OTP_MINUTES = Math.floor(OTP_TTL_SECONDS / 60);

function otpKey(email: string) {
  return `otp:${email}`;
}
function rlKey(email: string) {
  return `otp_rl:${email}`;
}

const generateOTP = () => {
  const num = Math.floor(Math.random() * 10000);
  return num.toString().padStart(4, "0");
};
async function sendEmailOTP(email: string, otp: string) {
  const subject = `${APP_NAME} Verification Code`;
  const text = `Your ${APP_NAME} verification code is ${otp}. It expires in ${OTP_MINUTES} minutes. Do not share this code with anyone.`;
  const html = `
  <div style="background:#f6f8fb;padding:24px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #f1f5f9;">
          <div style="font-size:16px;font-weight:600;color:#111827;">${APP_NAME}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <h1 style="margin:0 0 8px 0;font-size:18px;color:#111827;">Verify your email</h1>
          <p style="margin:0 0 16px 0;font-size:14px;color:#334155;">Use the following code to verify your email address. This code expires in ${OTP_MINUTES} minutes.</p>
          <div style="display:inline-block;padding:12px 20px;border:1px dashed #94a3b8;border-radius:8px;font-size:24px;letter-spacing:4px;font-weight:700;color:#0f172a;background:#f8fafc;">${otp}</div>
          <p style="margin:16px 0 0 0;font-size:12px;color:#64748b;">If you didn’t request this, you can safely ignore this email.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 24px;background:#f8fafc;border-top:1px solid #f1f5f9;font-size:12px;color:#64748b;">
          © ${new Date().getFullYear()} ${APP_NAME}
        </td>
      </tr>
    </table>
  </div>`;

  await transporter.sendMail({
    from: mailFrom,
    to: email,
    subject,
    text,
    html,
  });
}

export async function issueOTP(email: string) {
  const otp = generateOTP();
  console.log(otp);
  await redis.set(otpKey(email), otp, "EX", OTP_TTL_SECONDS);

  await sendEmailOTP(email, otp);
}

export async function verifyOTP(email: string, otp: string) {
  const stored = await redis.get(otpKey(email));
  if (!stored) return { ok: false, reason: "expired_or_missing" };
  if (stored !== otp) return { ok: false, reason: "invalid" };
  await redis.del(otpKey(email));
  return { ok: true };
}

export async function resendOTP(email: string) {
  const allowed = await withinRateLimit(rlKey(email), RESEND_LIMIT, 3600);
  if (!allowed) return { ok: false, reason: "rate_limited" };
  await issueOTP(email);
  return { ok: true };
}
