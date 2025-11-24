import { prisma } from "../lib/prisma";
import { UserRole, UserStatus } from "@prisma/client";

export const adminUserRepo = {
  listUsers(params: {
    q?: string;
    role?: UserRole;
    status?: UserStatus;
    take: number;
    skip: number;
  }) {
    const { q, role, status, take, skip } = params;
    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { email: { contains: term, mode: "insensitive" } },
        { phone: { contains: term } },
        { name: { contains: term, mode: "insensitive" } },
      ];
    }
    return prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        phoneVerifiedAt: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });
  },

  countUsers(params: { q?: string; role?: UserRole; status?: UserStatus }) {
    const { q, role, status } = params;
    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { email: { contains: term, mode: "insensitive" } },
        { phone: { contains: term } },
        { name: { contains: term, mode: "insensitive" } },
      ];
    }
    return prisma.user.count({ where });
  },

  updateStatus(id: string, status: UserStatus) {
    return prisma.user.update({ where: { id }, data: { status } });
  },
};
