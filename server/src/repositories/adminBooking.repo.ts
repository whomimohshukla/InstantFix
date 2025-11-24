import { prisma } from "../lib/prisma";
import { BookingStatus } from "@prisma/client";

export const adminBookingRepo = {
  list(params: {
    status?: BookingStatus;
    customerId?: string;
    technicianId?: string;
    serviceId?: string;
    from?: Date | null;
    to?: Date | null;
    take: number;
    skip: number;
  }) {
    const { status, customerId, technicianId, serviceId, from, to, take, skip } = params;
    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (technicianId) where.technicianId = technicianId;
    if (serviceId) where.serviceId = serviceId;
    if (from || to) where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

    return prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        customer: { select: { id: true, email: true, name: true } },
        technician: { select: { id: true, email: true, name: true } },
        service: { select: { id: true, name: true, categoryId: true } },
        address: { select: { id: true, city: true, state: true, lat: true, lng: true } },
      },
    });
  },

  count(params: {
    status?: BookingStatus;
    customerId?: string;
    technicianId?: string;
    serviceId?: string;
    from?: Date | null;
    to?: Date | null;
  }) {
    const { status, customerId, technicianId, serviceId, from, to } = params;
    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (technicianId) where.technicianId = technicianId;
    if (serviceId) where.serviceId = serviceId;
    if (from || to) where.createdAt = { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) };

    return prisma.booking.count({ where });
  },

  getById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, email: true, name: true } },
        technician: { select: { id: true, email: true, name: true } },
        service: true,
        address: true,
        payments: true,
        media: true,
        dispatchOffers: true,
        dispute: true,
      },
    });
  },

  updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({ where: { id }, data: { status } });
  },

  reassignTechnician(id: string, technicianId: string | null) {
    return prisma.booking.update({ where: { id }, data: { technicianId } });
  },
};
