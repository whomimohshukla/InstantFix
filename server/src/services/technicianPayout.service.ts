import { prisma } from "../lib/prisma";

export const technicianPayoutService = {
  async list(userId: string, query: any) {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const { limit, skip } = query || {};
    const take = Math.min(parseInt(limit || "20", 10) || 20, 100);
    const off = parseInt(skip || "0", 10) || 0;

    const [rows, total] = await Promise.all([
      prisma.payout.findMany({
        where: { technicianId: profile.id },
        orderBy: { createdAt: "desc" },
        take,
        skip: off,
      }),
      prisma.payout.count({ where: { technicianId: profile.id } }),
    ]);

    return { ok: true, status: 200, data: { rows, total, take, skip: off } } as const;
  },
};
