import { Router } from "express";
import { signupCtrl, verifyOtpCtrl, resendOtpCtrl, loginCtrl, availabilityCtrl } from "../controllers/Auth.controllers";
import { phoneSendOtpCtrl, phoneVerifyOtpCtrl, phoneResendOtpCtrl } from "../controllers/Phone.controllers";

export const authRouter = Router();

authRouter.post("/signup", signupCtrl);
authRouter.post("/verify-otp", verifyOtpCtrl);
authRouter.post("/resend-otp", resendOtpCtrl);
authRouter.post("/login", loginCtrl);
authRouter.get("/availability", availabilityCtrl);

// Phone-based OTP (login via phone)
authRouter.post("/phone/send-otp", phoneSendOtpCtrl);
authRouter.post("/phone/verify-otp", phoneVerifyOtpCtrl);
authRouter.post("/phone/resend-otp", phoneResendOtpCtrl);
