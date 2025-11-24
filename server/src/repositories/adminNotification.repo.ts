import { prisma } from "../lib/prisma";
import { NotificationChannel, UserRole } from "@prisma/client";

export const adminNotificationRepo = {
  create(userId: string, channel: NotificationChannel, title: string, body: string) {
    return prisma.notification.create({
      data: { userId, channel, title, body },
    });
  },

  listByUser(userId: string, take = 20, skip = 0) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },

  // Danger: use with care in large DBs. Keep a maxLimit to prevent huge broadcasts.
  listUsersByRole(role: UserRole, take = 1000) {
    return prisma.user.findMany({
      where: { role },
      take,
      select: { id: true, email: true, phone: true },
    });
  },
};
