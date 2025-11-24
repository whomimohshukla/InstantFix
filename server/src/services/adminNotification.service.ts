import { adminNotificationRepo } from "../repositories/adminNotification.repo";
import { NotificationChannel, UserRole } from "@prisma/client";
import transporter, { mailFrom } from "../config/mailer";
import { plivoClient, plivoFrom } from "../config/plivo";
import { prisma } from "../lib/prisma";

async function sendEmail(to: string | null | undefined, title: string, body: string) {
  if (!to) return;
  try {
    await transporter.sendMail({ from: mailFrom, to, subject: title, text: body, html: `<p>${body}</p>` });
  } catch {}
}

async function sendSms(to: string | null | undefined, text: string) {
  if (!to) return;
  try {
    await plivoClient.messages.create(plivoFrom, to, text);
  } catch {}
}

async function sendPush(userId: string, title: string, body: string) {
  // Stub push: collect tokens and NOOP. Integrate FCM/APNS later.
  const devices = await prisma.device.findMany({ where: { userId, pushToken: { not: null } }, select: { pushToken: true, platform: true } });
  if (!devices.length) return;
  // TODO: integrate FCM/APNS. For now, this is a no-op after collecting tokens.
}

export const adminNotificationService = {
  // Send to a single user
  async sendToUser(body: any) {
    const { userId, channel, title, message } = body || {};
    if (!userId || !channel || !title || !message) return { ok: false, status: 400, message: "userId, channel, title, message required" } as const;
    if (!["EMAIL", "SMS", "PUSH"].includes(channel)) return { ok: false, status: 400, message: "channel must be EMAIL|SMS|PUSH" } as const;

    // Create DB notification
    await adminNotificationRepo.create(userId, channel as NotificationChannel, title, message);

    // Deliver
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, phone: true } });
    if (channel === "EMAIL") await sendEmail(user?.email, title, message);
    if (channel === "SMS") await sendSms(user?.phone ?? undefined, `${title}: ${message}`);
    if (channel === "PUSH") await sendPush(userId, title, message);

    return { ok: true, status: 200, message: "Sent" } as const;
  },

  // Broadcast to a role (capped)
  async broadcast(body: any) {
    const { role, channel, title, message, max = 1000 } = body || {};
    if (!role || !channel || !title || !message) return { ok: false, status: 400, message: "role, channel, title, message required" } as const;
    if (!["CUSTOMER", "TECHNICIAN", "ADMIN"].includes(role)) return { ok: false, status: 400, message: "invalid role" } as const;
    if (!["EMAIL", "SMS", "PUSH"].includes(channel)) return { ok: false, status: 400, message: "channel must be EMAIL|SMS|PUSH" } as const;

    const users = await adminNotificationRepo.listUsersByRole(role as UserRole, Math.min(Number(max) || 1000, 5000));
    let count = 0;
    for (const u of users) {
      await adminNotificationRepo.create(u.id, channel as NotificationChannel, title, message);
      if (channel === "EMAIL") await sendEmail(u.email, title, message);
      if (channel === "SMS") await sendSms(u.phone ?? undefined, `${title}: ${message}`);
      if (channel === "PUSH") await sendPush(u.id, title, message);
      count++;
    }
    return { ok: true, status: 200, data: { sent: count } } as const;
  },
};
