import redis from "../config/redis";
import transporter, { mailFrom } from "../config/mailer";
// import { generateOTP } from "../utils/otp.js";
import { withinRateLimit } from "./rateLimit";

const OTP_TTL_SECONDS = 600; // 10 minutes
const RESEND_LIMIT = 10; // per hour

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
  await transporter.sendMail({
    from: mailFrom,
    to: email,
    subject: "Your verification code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
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
