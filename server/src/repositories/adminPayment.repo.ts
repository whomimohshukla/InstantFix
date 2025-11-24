import { prisma } from "../lib/prisma";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

export const adminPaymentRepo = {
  list(params: {
    provider?: PaymentProvider;
    status?: PaymentStatus;
    bookingId?: string;
    take: number;
    skip: number;
  }) {
    const { provider, status, bookingId, take, skip } = params;
    const where: any = {};
    if (provider) where.provider = provider;
    if (status) where.status = status;
    if (bookingId) where.bookingId = bookingId;

    return prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        booking: {
          select: { id: true, customerId: true, technicianId: true, status: true },
        },
        refunds: true,
      },
    });
  },

  count(params: { provider?: PaymentProvider; status?: PaymentStatus; bookingId?: string }) {
    const { provider, status, bookingId } = params;
    const where: any = {};
    if (provider) where.provider = provider;
    if (status) where.status = status;
    if (bookingId) where.bookingId = bookingId;
    return prisma.payment.count({ where });
  },

  getById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: { booking: true, refunds: true },
    });
  },

  createRefund(paymentId: string, amount: number, reason?: string | null) {
    return prisma.refund.create({
      data: { paymentId, amount, reason: reason ?? null },
    });
  },

  listRefunds(params: { paymentId?: string; take: number; skip: number }) {
    const { paymentId, take, skip } = params;
    return prisma.refund.findMany({
      where: { ...(paymentId ? { paymentId } : {}) },
      orderBy: { createdAt: "desc" },
      take,
      skip,
    });
  },

  getRefundById(id: string) {
    return prisma.refund.findUnique({ where: { id } });
  },
};
