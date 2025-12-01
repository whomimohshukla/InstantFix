import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

// Ensure environment variables are set
const { MAIL_HOST, MAIL_USER, MAIL_PASS } = process.env;
if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
	console.warn("Mail configuration is incomplete.");
}

const transporter =
	MAIL_HOST && MAIL_USER && MAIL_PASS
		? nodemailer.createTransport({
				host: MAIL_HOST,
				port: 587,
				secure: false,
				auth: {
					user: MAIL_USER,
					pass: MAIL_PASS,
				},
		  })
		: nodemailer.createTransport({ jsonTransport: true });

export const mailFrom =
	process.env.MAIL_FROM || "InstantFix <no-reply@instantfix.com>";
export default transporter;
