import { prisma } from "../lib/prisma";
import { VerificationStatus } from "@prisma/client";

export const adminTechnicianRepo = {
  listVerificationRequests(status?: VerificationStatus, take = 20, skip = 0) {
    return prisma.verificationRequest.findMany({
      where: { ...(status ? { status } : {}) },
      orderBy: { createdAt: "asc" },
      take,
      skip,
      include: {
        technician: {
          include: {
            user: { select: { id: true, email: true, phone: true, name: true, role: true, status: true } },
          },
        },
      },
    });
  },

  getVerificationRequestById(id: string) {
    return prisma.verificationRequest.findUnique({
      where: { id },
      include: {
        technician: {
          include: {
            user: { select: { id: true, email: true, phone: true, name: true, role: true, status: true } },
          },
        },
      },
    });
  },

  updateVerificationRequestStatus(id: string, status: VerificationStatus, reviewedById: string, notes?: string | null) {
    return prisma.verificationRequest.update({
      where: { id },
      data: { status, reviewedById, reviewedAt: new Date(), notes: typeof notes === "undefined" ? undefined : notes },
    });
  },
};
