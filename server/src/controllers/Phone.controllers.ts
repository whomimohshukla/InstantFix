import { Request, Response } from "express";
import { issuePhoneOTP, verifyPhoneOTP, resendPhoneOTP } from "../services/phoneOtp.service";

export async function phoneSendOtpCtrl(req: Request, res: Response) {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ ok: false, message: "phone required" });
  const result = await issuePhoneOTP(phone);
  return res.status(result.status).json(result);
}

export async function phoneVerifyOtpCtrl(req: Request, res: Response) {
  const { phone, otp } = req.body || {};
  if (!phone || !otp) return res.status(400).json({ ok: false, message: "phone and otp required" });
  const result = await verifyPhoneOTP(phone, otp);
  return res.status(result.status).json(result);
}

export async function phoneResendOtpCtrl(req: Request, res: Response) {
  const { phone } = req.body || {};
  if (!phone) return res.status(400).json({ ok: false, message: "phone required" });
  const result = await resendPhoneOTP(phone);
  return res.status(result.status).json(result);
}
