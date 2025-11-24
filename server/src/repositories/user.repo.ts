import { prisma } from "../lib/prisma";

export const userRepo = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  },
  existsByEmail(email: string) {
    return prisma.user.count({ where: { email } }).then((c) => c > 0);
  },
  existsByPhone(phone: string) {
    return prisma.user.count({ where: { phone } }).then((c) => c > 0);
  },
  create(data: {
    email: string;
    passwordHash: string;
    name?: string | null;
    phone?: string | null;
    role?: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  }) {
    const role = data.role || ("CUSTOMER" as any);
    const { role: _r, ...rest } = data as any;
    return prisma.user.create({ data: { ...rest, role } });
  },
  createCustomerProfile(userId: string) {
    return prisma.customerProfile.create({ data: { userId } });
  },
  createTechnicianProfile(userId: string) {
    return prisma.technicianProfile.create({ data: { userId } });
  },
  getTechnicianProfileByUserId(userId: string) {
    return prisma.technicianProfile.findUnique({ where: { userId } });
  },
  updateTechnicianProfile(
    userId: string,
    data: {
      headline?: string | null;
      bio?: string | null;
      yearsExperience?: number;
      skills?: string[];
      toolset?: string[];
      hasVehicle?: boolean;
      hourlyRate?: number | null;
    }
  ) {
    return prisma.technicianProfile.update({ where: { userId }, data });
  },
  markVerified(email: string) {
    // If you decide to add a `verified` boolean column later, update here accordingly.
    return prisma.user.update({ where: { email }, data: {} });
  },
  markEmailVerified(email: string) {
    return prisma.user.update({
      where: { email },
      data: { emailVerifiedAt: new Date() },
    });
  },
  markPhoneVerified(phone: string) {
    return prisma.user.update({
      where: { phone },
      data: { phoneVerifiedAt: new Date() },
    });
  },
};
