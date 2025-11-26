import { bookingRepo } from "../repositories/booking.repo";
import { addressRepo } from "../repositories/address.repo";
import { catalogRepo } from "../repositories/catalog.repo";
import { prisma } from "../lib/prisma";

export const bookingService = {
  async create(customerId: string, body: any) {
    const { serviceId, addressId, scheduledAt, notes, paymentMode } = body || {};
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
      paymentMode: paymentMode || null,
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

  async cancel(customerId: string, id: string, body: any) {
    const reason = body?.reason ? String(body.reason) : null;

    const booking = await prisma.booking.findFirst({
      where: { id, customerId },
      select: { status: true },
    });
    if (!booking)
      return { ok: false, status: 404, message: "Not found" } as const;

    // Disallow cancel once job has effectively started or finished
    if (
      booking.status === "COMPLETED" ||
      booking.status === "CANCELED" ||
      booking.status === "ENROUTE" ||
      booking.status === "IN_PROGRESS"
    ) {
      return {
        ok: false,
        status: 400,
        message: "Booking cannot be canceled at this stage",
      } as const;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELED", ...(reason ? { notes: reason } : {}) },
    });

    return { ok: true, status: 200, data: updated } as const;
  },

  async rate(customerId: string, id: string, body: any) {
    const rating = Number(body?.rating ?? 0);
    const comments = body?.comments ? String(body.comments) : null;
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return {
        ok: false,
        status: 400,
        message: "rating must be between 1 and 5",
      } as const;
    }

    const booking = await prisma.booking.findFirst({
      where: { id, customerId },
      select: { id: true, status: true, technicianId: true },
    });
    if (!booking)
      return { ok: false, status: 404, message: "Not found" } as const;
    if (booking.status !== "COMPLETED") {
      return {
        ok: false,
        status: 400,
        message: "You can rate only completed bookings",
      } as const;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Upsert review for this booking/customer
      const review = await tx.review.upsert({
        where: { bookingId: booking.id },
        create: {
          bookingId: booking.id,
          customerId,
          rating,
          comments,
        },
        update: {
          rating,
          comments,
        },
      });

      // Update technician aggregates if we know which tech served this booking
      if (booking.technicianId) {
        const techProfile = await tx.technicianProfile.findUnique({
          where: { userId: booking.technicianId },
        });

        if (techProfile) {
          const agg = await tx.review.aggregate({
            _avg: { rating: true },
            _count: { rating: true },
            where: {
              booking: { technicianId: booking.technicianId },
            },
          });

          await tx.technicianProfile.update({
            where: { id: techProfile.id },
            data: {
              ratingAvg: agg._avg.rating ?? 0,
              ratingCount: agg._count.rating ?? 0,
            },
          });
        }
      }

      return review;
    });

    return { ok: true, status: 200, data: result } as const;
  },
  async openDispute(customerId: string, id: string, body: any) {
		const reason = body?.reason ? String(body.reason) : null;
		if (!reason)
			return {
				ok: false,
				status: 400,
				message: "reason required",
			} as const;

		const booking = await prisma.booking.findFirst({
			where: { id, customerId },
			select: { id: true, status: true },
		});
		if (!booking)
			return { ok: false, status: 404, message: "Not found" } as const;
		if (booking.status !== "COMPLETED" && booking.status !== "CANCELED") {
			return {
				ok: false,
				status: 400,
				message: "You can open a dispute only for completed or canceled bookings",
			} as const;
		}

		const existing = await prisma.dispute.findUnique({
			where: { bookingId: booking.id },
		});
		if (existing)
			return {
				ok: false,
				status: 409,
				message: "Dispute already exists for this booking",
			} as const;

		const created = await prisma.dispute.create({
			data: {
				bookingId: booking.id,
				openedById: customerId,
				reason,
				status: "OPEN" as any,
			},
		});
		return { ok: true, status: 201, data: created } as const;
	},

	async getDispute(customerId: string, id: string) {
		const booking = await prisma.booking.findFirst({
			where: { id, customerId },
			select: { id: true },
		});
		if (!booking)
			return { ok: false, status: 404, message: "Not found" } as const;

		const dispute = await prisma.dispute.findUnique({
			where: { bookingId: booking.id },
		});
		if (!dispute)
			return { ok: false, status: 404, message: "Dispute not found" } as const;
		return { ok: true, status: 200, data: dispute } as const;
	},
};
