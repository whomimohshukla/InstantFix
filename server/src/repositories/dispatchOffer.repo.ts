import { prisma } from "../lib/prisma";

export const dispatchOfferRepo = {
  listForTechnician(technicianUserId: string) {
    return prisma.dispatchOffer.findMany({
      where: {
        technicianId: technicianUserId,
        status: "offered",
      },
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          include: {
            service: true,
            address: true,
          },
        },
      },
    });
  },

  getByIdForTechnician(id: string, technicianUserId: string) {
    return prisma.dispatchOffer.findFirst({
      where: { id, technicianId: technicianUserId },
      include: { booking: true },
    });
  },

  acceptOffer(id: string) {
    return prisma.dispatchOffer.update({
      where: { id },
      data: { status: "accepted" },
    });
  },

  rejectOffer(id: string) {
    return prisma.dispatchOffer.update({
      where: { id },
      data: { status: "rejected" },
    });
  },

  expireOtherOffers(bookingId: string, acceptedOfferId: string) {
    return prisma.dispatchOffer.updateMany({
      where: {
        bookingId,
        id: { not: acceptedOfferId },
        status: "offered",
      },
      data: { status: "expired" },
    });
  },
};
