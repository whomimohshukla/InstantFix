import { adminBookingRepo } from "../repositories/adminBooking.repo";
import { BookingStatus } from "@prisma/client";

function parseDate(input?: string): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

export const adminBookingService = {
  async list(query: any) {
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const status = (query?.status as BookingStatus | undefined) || undefined;
    const customerId = (query?.customerId as string | undefined) || undefined;
    const technicianId = (query?.technicianId as string | undefined) || undefined;
    const serviceId = (query?.serviceId as string | undefined) || undefined;
    const from = parseDate(query?.from as string | undefined);
    const to = parseDate(query?.to as string | undefined);

    const [rows, total] = await Promise.all([
      adminBookingRepo.list({ status, customerId, technicianId, serviceId, from, to, take, skip }),
      adminBookingRepo.count({ status, customerId, technicianId, serviceId, from, to }),
    ]);
    return { ok: true, status: 200, data: { rows, total, take, skip } } as const;
  },

  async get(id: string) {
    const row = await adminBookingRepo.getById(id);
    if (!row) return { ok: false, status: 404, message: "Not found" } as const;
    return { ok: true, status: 200, data: row } as const;
  },

  async updateStatus(id: string, body: any) {
    const status = body?.status as BookingStatus | undefined;
    const valid: BookingStatus[] = [
      "PENDING",
      "CONFIRMED",
      "ASSIGNED",
      "ENROUTE",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELED",
    ];
    if (!status || !valid.includes(status))
      return { ok: false, status: 400, message: `status must be one of ${valid.join(",")}` } as const;
    const row = await adminBookingRepo.updateStatus(id, status);
    return { ok: true, status: 200, data: row } as const;
  },

  async reassign(id: string, body: any) {
    const technicianId = (body?.technicianId as string | null | undefined) ?? null;
    const row = await adminBookingRepo.reassignTechnician(id, technicianId);
    return { ok: true, status: 200, data: row } as const;
  },
};
