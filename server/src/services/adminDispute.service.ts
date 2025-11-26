import { prisma } from "../lib/prisma";
import { adminPaymentService } from "./adminPayment.service";

export const adminDisputeService = {
  async list(query: any) {
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const status = (query?.status as any) || undefined;

    const where: any = {};
    if (status) where.status = status;

    const [rows, total] = await Promise.all([
      prisma.dispute.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          booking: {
            include: {
              customer: true,
              technician: true,
              service: true,
            },
          },
          openedBy: true,
        },
      }),
      prisma.dispute.count({ where }),
    ]);

    return { ok: true, status: 200, data: { rows, total, take, skip } } as const;
  },

  async get(id: string) {
    const row = await prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            customer: true,
            technician: true,
            service: true,
            payments: {
              include: { refunds: true },
            },
          },
        },
        openedBy: true,
      },
    });
    if (!row) return { ok: false, status: 404, message: "Not found" } as const;
    return { ok: true, status: 200, data: row } as const;
  },

  async resolve(id: string, body: any, adminUserId: string) {
    const { status, resolution, createRefund, refundAmount } = body || {};
    if (!status)
      return { ok: false, status: 400, message: "status required" } as const;

    const allowed = ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"];
    if (!allowed.includes(status))
      return { ok: false, status: 400, message: "invalid status" } as const;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: {
          include: { payments: true },
        },
      },
    });
    if (!dispute)
      return { ok: false, status: 404, message: "Not found" } as const;

    let refund: any = null;
    if (createRefund && typeof refundAmount === "number" && refundAmount > 0) {
      const payment = dispute.booking.payments.find((p) => p.status === "SUCCEEDED");
      if (payment) {
        const refundResult = await adminPaymentService.createRefund({
          paymentId: payment.id,
          amount: refundAmount,
          reason: resolution || `Dispute ${id}`,
        });
        if (refundResult.ok) refund = refundResult.data;
      }
    }

    const updated = await prisma.dispute.update({
      where: { id },
      data: {
        status,
        resolution: resolution ?? null,
        resolvedAt:
          status === "RESOLVED" || status === "REJECTED" ? new Date() : null,
      },
    });

    await prisma.adminActionLog.create({
      data: {
        actorId: adminUserId,
        entityType: "Dispute",
        entityId: id,
        action: "RESOLVE",
        diff: { status, resolution, refundAmount },
      },
    });

    return { ok: true, status: 200, data: { dispute: updated, refund } } as const;
  },
};
