import { bookingRepo } from "../repositories/booking.repo";
import { addressRepo } from "../repositories/address.repo";
import { catalogRepo } from "../repositories/catalog.repo";

export const bookingService = {
  async create(customerId: string, body: any) {
    const { serviceId, addressId, scheduledAt, notes } = body || {};
    if (!serviceId || !addressId)
      return {
        ok: false,
        status: 400,
        message: "serviceId and addressId required",
      };

    const [service, address] = await Promise.all([
      catalogRepo.getServiceById(serviceId),
      addressRepo.getById(addressId),
    ]);
    if (!service || !service.isActive)
      return { ok: false, status: 400, message: "Invalid or inactive service" };
    if (!address || address.userId !== customerId)
      return { ok: false, status: 403, message: "Address not owned" };

    const parsedScheduled = scheduledAt ? new Date(scheduledAt) : null;
    const created = await bookingRepo.create({
      customerId,
      serviceId,
      addressId,
      scheduledAt: parsedScheduled,
      notes,
    });
    return { ok: true, status: 201, data: created };
  },

  async listMine(customerId: string, query: any) {
    const { status, limit, skip } = query || {};
    const take = Math.min(parseInt(limit || "20", 10) || 20, 100);
    const off = parseInt(skip || "0", 10) || 0;
    const rows = await bookingRepo.listMine(customerId, status, take, off);
    return { ok: true, status: 200, data: rows };
  },

  async detail(customerId: string, id: string) {
    const row = await bookingRepo.getMineById(customerId, id);
    if (!row) return { ok: false, status: 404, message: "Not found" };
    return { ok: true, status: 200, data: row };
  },
};
