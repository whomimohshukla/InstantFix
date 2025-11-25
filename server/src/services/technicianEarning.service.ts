import { prisma } from "../lib/prisma";

export const technicianEarningService = {
  async summary(technicianUserId: string) {
    // Find technician profile
    const techProfile = await prisma.technicianProfile.findUnique({
      where: { userId: technicianUserId },
      select: { id: true },
    });
    if (!techProfile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const technicianId = techProfile.id;

    const [totals, payouts] = await Promise.all([
      prisma.earning.aggregate({
        _sum: { amount: true },
        where: { technicianId },
      }),
      prisma.payout.aggregate({
        _sum: { amount: true },
        where: { technicianId },
      }),
    ]);

    const totalEarnings = totals._sum.amount || 0;
    const totalPaid = payouts._sum.amount || 0;
    const totalPending = totalEarnings - totalPaid;

    return {
      ok: true,
      status: 200,
      data: {
        totalEarnings,
        totalPaid,
        totalPending,
      },
    } as const;
  },

  async list(technicianUserId: string, query: any) {
    const techProfile = await prisma.technicianProfile.findUnique({
      where: { userId: technicianUserId },
      select: { id: true },
    });
    if (!techProfile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const technicianId = techProfile.id;
    const { limit, skip } = query || {};
    const take = Math.min(parseInt(limit || "20", 10) || 20, 100);
    const off = parseInt(skip || "0", 10) || 0;

    const [rows, total] = await Promise.all([
      prisma.earning.findMany({
        where: { technicianId },
        orderBy: { createdAt: "desc" },
        take,
        skip: off,
        include: {
          booking: {
            select: {
              id: true,
              status: true,
              service: { select: { id: true, name: true } },
              createdAt: true,
            },
          },
        },
      }),
      prisma.earning.count({ where: { technicianId } }),
    ]);

    return {
      ok: true,
      status: 200,
      data: { rows, total, take, skip: off },
    } as const;
  },
};
