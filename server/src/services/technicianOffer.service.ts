import { prisma } from "../lib/prisma";
import { dispatchOfferRepo } from "../repositories/dispatchOffer.repo";
import { BookingStatus } from "@prisma/client";

export const technicianOfferService = {
  async listMyOffers(technicianUserId: string) {
    const rows = await dispatchOfferRepo.listForTechnician(technicianUserId);
    return { ok: true, status: 200, data: rows } as const;
  },

  async acceptOffer(technicianUserId: string, offerId: string) {
    return await prisma.$transaction(async (tx) => {
      const offer = await tx.dispatchOffer.findFirst({
        where: { id: offerId, technicianId: technicianUserId, status: "offered" },
        include: { booking: true },
      });
      if (!offer)
        return { ok: false, status: 404, message: "Offer not found or already handled" } as const;

      // Assign booking to technician and move status to ASSIGNED if appropriate
      await tx.booking.update({
        where: { id: offer.bookingId },
        data: {
          technicianId: technicianUserId,
          status:
            offer.booking.status === BookingStatus.CONFIRMED
              ? BookingStatus.ASSIGNED
              : offer.booking.status,
        },
      });

      await tx.dispatchOffer.update({ where: { id: offer.id }, data: { status: "accepted" } });
      await tx.dispatchOffer.updateMany({
        where: {
          bookingId: offer.bookingId,
          id: { not: offer.id },
          status: "offered",
        },
        data: { status: "expired" },
      });

      return { ok: true, status: 200, data: { bookingId: offer.bookingId } } as const;
    });
  },

  async rejectOffer(technicianUserId: string, offerId: string) {
    const offer = await dispatchOfferRepo.getByIdForTechnician(offerId, technicianUserId);
    if (!offer || offer.status !== "offered")
      return { ok: false, status: 404, message: "Offer not found or already handled" } as const;
    await dispatchOfferRepo.rejectOffer(offerId);
    return { ok: true, status: 200, data: { bookingId: offer.bookingId } } as const;
  },
};
