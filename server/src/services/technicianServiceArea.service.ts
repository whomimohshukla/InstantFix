import { prisma } from "../lib/prisma";

export const technicianServiceAreaService = {
  async list(userId: string) {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const rows = await prisma.technicianServiceArea.findMany({
      where: { technicianId: profile.id },
      orderBy: { createdAt: "desc" },
    });
    return { ok: true, status: 200, data: rows } as const;
  },

  async upsert(userId: string, body: any) {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const { centerLat, centerLng, radiusKm } = body || {};
    if (
      typeof centerLat !== "number" ||
      typeof centerLng !== "number" ||
      (radiusKm !== undefined && typeof radiusKm !== "number")
    ) {
      return {
        ok: false,
        status: 400,
        message: "centerLat, centerLng must be numbers; radiusKm optional number",
      } as const;
    }

    const created = await prisma.technicianServiceArea.create({
      data: {
        technicianId: profile.id,
        centerLat,
        centerLng,
        radiusKm: radiusKm ?? 10,
      },
    });
    return { ok: true, status: 201, data: created } as const;
  },

  async remove(userId: string, id: string) {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile)
      return { ok: false, status: 404, message: "Technician profile not found" } as const;

    const existing = await prisma.technicianServiceArea.findFirst({
      where: { id, technicianId: profile.id },
    });
    if (!existing)
      return { ok: false, status: 404, message: "Service area not found" } as const;

    await prisma.technicianServiceArea.delete({ where: { id } });
    return { ok: true, status: 200, message: "Deleted" } as const;
  },
};
