import { prisma } from "../lib/prisma";
import { DayOfWeek } from "@prisma/client";

export const technicianAvailabilityService = {
  async list(userId: string) {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const rows = await prisma.technicianAvailability.findMany({
      where: { technicianId: profile.id },
      orderBy: [{ dayOfWeek: "asc" }, { startTimeMin: "asc" }],
    });
    return { ok: true, status: 200, data: rows } as const;
  },

  // Replace existing availability with new set of slots
  async set(userId: string, body: any) {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const slots = (body?.slots as any[]) || [];
    if (!Array.isArray(slots) || slots.length === 0)
      return { ok: false, status: 400, message: "slots array required" } as const;

    const values = [] as {
      dayOfWeek: DayOfWeek;
      startTimeMin: number;
      endTimeMin: number;
    }[];

    for (const s of slots) {
      const day = s.dayOfWeek as DayOfWeek | undefined;
      const start = s.startTimeMin;
      const end = s.endTimeMin;
      if (!day || typeof start !== "number" || typeof end !== "number" || start >= end) {
        return {
          ok: false,
          status: 400,
          message: "Each slot requires valid dayOfWeek, startTimeMin < endTimeMin",
        } as const;
      }
      values.push({ dayOfWeek: day, startTimeMin: start, endTimeMin: end });
    }

    await prisma.$transaction(async (tx) => {
      await tx.technicianAvailability.deleteMany({ where: { technicianId: profile.id } });
      for (const v of values) {
        await tx.technicianAvailability.create({
          data: {
            technicianId: profile.id,
            dayOfWeek: v.dayOfWeek,
            startTimeMin: v.startTimeMin,
            endTimeMin: v.endTimeMin,
          },
        });
      }
    });

    return { ok: true, status: 200, message: "Availability updated" } as const;
  },
};
