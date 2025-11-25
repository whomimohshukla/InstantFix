import { prisma } from "../lib/prisma";

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// Haversine distance in km
function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const adminDispatchService = {
  async dispatchForBooking(id: string, body: any) {
    const maxTechnicians = Math.min(
      parseInt(body?.maxTechnicians || "5", 10) || 5,
      20
    );
    const maxRadiusKm =
      typeof body?.maxRadiusKm === "number" && body.maxRadiusKm > 0
        ? body.maxRadiusKm
        : 10;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { address: true },
    });
    if (!booking)
      return { ok: false, status: 404, message: "Booking not found" } as const;
    if (!booking.address?.lat || !booking.address?.lng)
      return {
        ok: false,
        status: 400,
        message: "Booking address missing lat/lng",
      } as const;

    const { lat, lng } = booking.address;

    // Fetch all technician profiles with at least one service area
    const techs = await prisma.technicianProfile.findMany({
      include: { serviceAreas: true, user: { select: { id: true, status: true } } },
    });

    const candidates: { technicianUserId: string; distance: number }[] = [];
    for (const t of techs as any[]) {
      if (!t.user || t.user.status !== "ACTIVE") continue;
      if (!t.serviceAreas || t.serviceAreas.length === 0) continue;
      let bestDist: number | null = null;
      for (const area of t.serviceAreas) {
        const d = distanceKm(lat, lng, area.centerLat, area.centerLng);
        if (d <= area.radiusKm && d <= maxRadiusKm) {
          if (bestDist == null || d < bestDist) bestDist = d;
        }
      }
      if (bestDist != null) {
        candidates.push({ technicianUserId: t.user.id, distance: bestDist });
      }
    }

    if (candidates.length === 0)
      return { ok: false, status: 404, message: "No nearby technicians found" } as const;

    // Sort by distance and take top N
    candidates.sort((a, b) => a.distance - b.distance);
    const selected = candidates.slice(0, maxTechnicians);

    // Avoid duplicate offers for same booking/technician
    const existingOffers = await prisma.dispatchOffer.findMany({
      where: { bookingId: booking.id },
      select: { technicianId: true },
    });
    const existingTechIds = new Set(existingOffers.map((o) => o.technicianId));

    let created = 0;
    for (const c of selected) {
      if (existingTechIds.has(c.technicianUserId)) continue;
      await prisma.dispatchOffer.create({
        data: {
          bookingId: booking.id,
          technicianId: c.technicianUserId,
          status: "offered",
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });
      created++;
    }

    return { ok: true, status: 201, data: { created } } as const;
  },
};
