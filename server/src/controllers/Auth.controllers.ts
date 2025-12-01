import { Request, Response } from "express";
import { signup, verifyOtp, resendOtp, login } from "../services/auth";
import { userRepo } from "../repositories/user.repo";

export async function signupCtrl(req: Request, res: Response) {
	const { email, password, name, phone, role } = req.body || {};
	if (!email || !password)
		return res
			.status(400)
			.json({ ok: false, message: "email and password required" });
	const result = await signup({ email, password, name, phone, role });
	return res.status(result.status).json(result);
}

export async function verifyOtpCtrl(req: Request, res: Response) {
	const { email, otp } = req.body || {};
	if (!email || !otp)
		return res
			.status(400)
			.json({ ok: false, message: "email and otp required" });
	const result = await verifyOtp({ email, otp });
	return res.status(result.status).json(result);
}

export async function resendOtpCtrl(req: Request, res: Response) {
	const { email } = req.body || {};
	if (!email)
		return res.status(400).json({ ok: false, message: "email required" });
	const result = await resendOtp({ email });
	return res.status(result.status).json(result);
}

export async function loginCtrl(req: Request, res: Response) {
	const { email, password, role } = req.body || {};
	if (!email || !password)
		return res
			.status(400)
			.json({ ok: false, message: "email and password required" });
	const ipHeader = (req.headers["x-forwarded-for"] as string | undefined)
		?.split(",")[0]
		?.trim();
	const ip = ipHeader || (req.socket as any)?.remoteAddress || req.ip || null;
	const userAgent = (req.headers["user-agent"] as string | undefined) || null;
	const result = await login({ email, password, role, ip, userAgent });
	return res.status(result.status).json(result);
}

export async function availabilityCtrl(req: Request, res: Response) {
	const email = (req.query.email as string | undefined)?.trim().toLowerCase();
	const phone = (req.query.phone as string | undefined)?.trim();
	if (!email && !phone)
		return res
			.status(400)
			.json({ ok: false, message: "email or phone required" });

	const [emailExists, phoneExists] = await Promise.all([
		email ? userRepo.existsByEmail(email) : Promise.resolve(undefined),
		phone ? userRepo.existsByPhone(phone) : Promise.resolve(undefined),
	]);

	return res.json({
		ok: true,
		email,
		phone,
		exists: {
			email: emailExists,
			phone: phoneExists,
		},
		available: {
			email: emailExists === undefined ? undefined : !emailExists,
			phone: phoneExists === undefined ? undefined : !phoneExists,
		},
	});
}
