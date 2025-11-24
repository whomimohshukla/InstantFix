import redis from "../config/redis";
import { bookingRepo } from "../repositories/booking.repo";

const keyForUser = (userId: string) => `live:loc:user:${userId}`;

export type LiveLocation = {
  lat: number;
  lng: number;
  accuracy?: number | null;
  ts: number; // epoch ms
};

export const liveLocationService = {
  async setUserLocation(userId: string, loc: { lat: number; lng: number; accuracy?: number | null }) {
    const payload: LiveLocation = { lat: loc.lat, lng: loc.lng, accuracy: loc.accuracy ?? null, ts: Date.now() };
    await redis.set(keyForUser(userId), JSON.stringify(payload), "EX", 60 * 60); // 1h TTL
    return payload;
  },

  async getUserLocation(userId: string): Promise<LiveLocation | null> {
    const raw = await redis.get(keyForUser(userId));
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  async customerCanViewTechnician(customerId: string, technicianUserId: string) {
    // Check if the customer has any booking assigned to this technician
    const rows = await bookingRepo.listMine(customerId, undefined, 50, 0);
    return rows.some((b: any) => b.technicianId === technicianUserId && ["ASSIGNED","ENROUTE","IN_PROGRESS"].includes(b.status));
  },
};
