import { prisma } from "../lib/prisma";

export const bookingRepo = {
  create(data: {
    customerId: string;
    serviceId: string;
    addressId: string;
    scheduledAt?: Date | null;
    notes?: string | null;
  }) {
    return prisma.booking.create({
      data: {
        customerId: data.customerId,
        serviceId: data.serviceId,
        addressId: data.addressId,
        scheduledAt: data.scheduledAt ?? null,
        status: "PENDING" as any,
        notes: data.notes ?? null,
      },
      include: { service: true, address: true },
    });
  },
  listMine(customerId: string, status?: string, take = 20, skip = 0) {
    return prisma.booking.findMany({
      where: { customerId, ...(status ? { status: status as any } : {}) },
      include: { service: true, address: true },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },
  getMineById(customerId: string, id: string) {
    return prisma.booking.findFirst({
      where: { id, customerId },
      include: {
        service: true,
        address: true,
        reviews: true,
        payments: true,
        media: true,
      },
    });
  },
};
