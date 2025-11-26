import { prisma } from "../lib/prisma";
import { BookingStatus } from "@prisma/client";

export const technicianBookingService = {
  async listMyBookings(technicianUserId: string, query: any) {
    const { status, limit, skip } = query || {};
    const take = Math.min(parseInt(limit || "20", 10) || 20, 100);
    const off = parseInt(skip || "0", 10) || 0;
    const where: any = { technicianId: technicianUserId };
    if (status) where.status = status as BookingStatus;

    const rows = await prisma.booking.findMany({
      where,
      include: { service: true, address: true },
      orderBy: { createdAt: "desc" },
      take,
      skip: off,
    });
    return { ok: true, status: 200, data: rows } as const;
  },

  async getMyBooking(technicianUserId: string, id: string) {
    const row = await prisma.booking.findFirst({
      where: { id, technicianId: technicianUserId },
      include: { service: true, address: true, payments: true, media: true },
    });
    if (!row) return { ok: false, status: 404, message: "Not found" } as const;
    return { ok: true, status: 200, data: row } as const;
  },

  async updateStatus(technicianUserId: string, id: string, body: any) {
    const nextStatus = body?.status as BookingStatus | undefined;
    const allowed: BookingStatus[] = [
      "ASSIGNED",
      "ENROUTE",
      "IN_PROGRESS",
      "COMPLETED",
    ];
    if (!nextStatus || !allowed.includes(nextStatus)) {
      return {
        ok: false,
        status: 400,
        message: `status must be one of ${allowed.join(",")}`,
      } as const;
    }

    // Load booking for this technician
    const booking = await prisma.booking.findFirst({
      where: { id, technicianId: technicianUserId },
      include: { service: true },
    });
    if (!booking)
      return { ok: false, status: 404, message: "Not found" } as const;

    // Enforce allowed transitions
    const from = booking.status as BookingStatus;
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      PENDING: [],
      CONFIRMED: ["ASSIGNED"],
      ASSIGNED: ["ENROUTE"],
      ENROUTE: ["IN_PROGRESS"],
      IN_PROGRESS: ["COMPLETED"],
      COMPLETED: [],
      CANCELED: [],
    };
    const possible = validTransitions[from] || [];
    if (!possible.includes(nextStatus)) {
      return {
        ok: false,
        status: 400,
        message: `Cannot change status from ${from} to ${nextStatus}`,
      } as const;
    }

    // If moving to COMPLETED, also create an Earning
    if (nextStatus === "COMPLETED") {
      const result = await prisma.$transaction(async (tx) => {
        // Resolve final price if missing, falling back to service.basePrice
        let price = booking.priceFinal ?? booking.priceQuoted ?? null;
        if (price == null) {
          const basePrice = booking.service?.basePrice ?? null;
          if (basePrice == null) {
            return {
              ok: false,
              status: 400,
              message: "Booking has no price set",
            } as const;
          }
          await tx.booking.update({
            where: { id: booking.id },
            data: { priceFinal: basePrice },
          });
          price = basePrice;
        }

        // Compute technician earning (e.g. 70% of final price)
        const earningAmount = Math.floor(price * 0.7);

        // Find technician profile for this user
        const techProfile = await tx.technicianProfile.findUnique({
          where: { userId: technicianUserId },
        });
        if (!techProfile) {
          return {
            ok: false,
            status: 400,
            message: "Technician profile missing",
          } as const;
        }

        const updatedBooking = await tx.booking.update({
          where: { id: booking.id },
          data: { status: nextStatus },
        });

        await tx.earning.create({
          data: {
            technicianId: techProfile.id,
            bookingId: booking.id,
            amount: earningAmount,
          },
        });

        return { ok: true, status: 200, data: updatedBooking } as const;
      });

      return result;
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: nextStatus },
    });
    return { ok: true, status: 200, data: updated } as const;
  },

	async cancelBooking(technicianUserId: string, id: string, body: any) {
		const reason = body?.reason ? String(body.reason) : null;

		const booking = await prisma.booking.findFirst({
			where: { id, technicianId: technicianUserId },
			select: { id: true, status: true, notes: true },
		});
		if (!booking)
			return { ok: false, status: 404, message: "Not found" } as const;

		if (booking.status === "COMPLETED" || booking.status === "CANCELED") {
			return {
				ok: false,
				status: 400,
				message: "Booking cannot be canceled at this stage",
			} as const;
		}

		const newNotes = reason
			? `${booking.notes ?? ""}\n[TECH_CANCEL] ${reason}`.trim()
			: booking.notes ?? null;

		const updated = await prisma.booking.update({
			where: { id: booking.id },
			data: { status: "CANCELED", notes: newNotes },
		});

		return { ok: true, status: 200, data: updated } as const;
	},

	async paymentCollected(technicianUserId: string, id: string, body: any) {
		const amount = body?.amount != null ? Number(body.amount) : null;
		if (amount != null && (!Number.isFinite(amount) || amount <= 0)) {
			return {
				ok: false,
				status: 400,
				message: "amount must be a positive number if provided",
			} as const;
		}

		const booking = await prisma.booking.findFirst({
			where: { id, technicianId: technicianUserId },
			select: { id: true, status: true },
		});
		if (!booking)
			return { ok: false, status: 404, message: "Not found" } as const;
		if (booking.status !== "COMPLETED") {
			return {
				ok: false,
				status: 400,
				message: "Payment can be marked collected only for completed bookings",
			} as const;
		}

		// Record an event for ops/admin to reconcile postpaid cash payments later
		await prisma.eventOutbox.create({
			data: {
				topic: "TECH_PAYMENT_COLLECTED",
				payload: {
					bookingId: booking.id,
					technicianUserId,
					amount,
					method: "CASH",
				},
			},
		});

		return { ok: true, status: 200, data: { bookingId: booking.id, amount } } as const;
	},
};
