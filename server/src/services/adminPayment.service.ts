import { adminPaymentRepo } from "../repositories/adminPayment.repo";
import { PaymentProvider, PaymentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { razorpayClient } from "../config/razorpay";

export const adminPaymentService = {
  async list(query: any) {
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const provider = (query?.provider as PaymentProvider | undefined) || undefined;
    const status = (query?.status as PaymentStatus | undefined) || undefined;
    const bookingId = (query?.bookingId as string | undefined) || undefined;

    const [rows, total] = await Promise.all([
      adminPaymentRepo.list({ provider, status, bookingId, take, skip }),
      adminPaymentRepo.count({ provider, status, bookingId }),
    ]);
    return { ok: true, status: 200, data: { rows, total, take, skip } } as const;
  },

  async get(id: string) {
    const row = await adminPaymentRepo.getById(id);
    if (!row) return { ok: false, status: 404, message: "Not found" } as const;
    return { ok: true, status: 200, data: row } as const;
  },

  async createRefund(body: any) {
    const { paymentId, amount, reason } = body || {};
    if (!paymentId || typeof amount !== "number" || amount <= 0)
      return { ok: false, status: 400, message: "paymentId and positive amount required" } as const;
    const refund = await adminPaymentRepo.createRefund(paymentId, amount, reason);
    return { ok: true, status: 201, data: refund } as const;
  },

  async listRefunds(query: any) {
    const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
    const skip = parseInt(query?.skip || "0", 10) || 0;
    const paymentId = (query?.paymentId as string | undefined) || undefined;
    const rows = await adminPaymentRepo.listRefunds({ paymentId, take, skip });
    return { ok: true, status: 200, data: { rows, take, skip } } as const;
  },

  async getRefund(id: string) {
    const row = await adminPaymentRepo.getRefundById(id);
    if (!row) return { ok: false, status: 404, message: "Not found" } as const;
    return { ok: true, status: 200, data: row } as const;
  },

  async reconcile(id: string) {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return { ok: false, status: 404, message: "Payment not found" } as const;

    if (payment.provider !== PaymentProvider.RAZORPAY)
      return { ok: false, status: 400, message: "Reconcile supported only for Razorpay" } as const;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
      return { ok: false, status: 500, message: "Razorpay not configured" } as const;

    // Fetch latest order info from Razorpay
    const order = await (razorpayClient as any).orders.fetch(payment.providerId);

    const orderStatus = (order?.status as string | undefined) || ""; // created | attempted | paid
    let mappedStatus: PaymentStatus | null = null;

    if (orderStatus === "paid") mappedStatus = PaymentStatus.SUCCEEDED;
    else if (orderStatus === "attempted" || orderStatus === "created") mappedStatus = PaymentStatus.INITIATED;

    const updates: Partial<{ status: PaymentStatus; amount: number }> = {};
    if (mappedStatus && mappedStatus !== payment.status) {
      updates.status = mappedStatus;
    }
    if (typeof order?.amount === "number" && order.amount !== payment.amount) {
      updates.amount = order.amount;
    }

    let updated = payment;
    if (Object.keys(updates).length > 0) {
      updated = await prisma.payment.update({ where: { id }, data: updates });
    }

    // If payment is now succeeded, mark booking paymentStatus as PAID
    if (updated.status === PaymentStatus.SUCCEEDED) {
      try {
        await prisma.booking.update({
          where: { id: updated.bookingId },
          data: { paymentStatus: "PAID" } as any,
        });
      } catch {
        // best-effort; do not fail reconcile if booking update fails
      }
    }

    return {
      ok: true,
      status: 200,
      data: {
        payment: updated,
        provider: { id: order?.id, status: orderStatus, amount: order?.amount },
      },
    } as const;
  },

	async listTechCashEvents(query: any) {
		const take = Math.min(parseInt(query?.limit || "20", 10) || 20, 100);
		const skip = parseInt(query?.skip || "0", 10) || 0;
		const processed =
			query?.processed !== undefined
				? query.processed === "true" || query.processed === true
				: false;

		const [rows, total] = await Promise.all([
			prisma.eventOutbox.findMany({
				where: { topic: "TECH_PAYMENT_COLLECTED", processed },
				orderBy: { createdAt: "desc" },
				take,
				skip,
			}),
			prisma.eventOutbox.count({
				where: { topic: "TECH_PAYMENT_COLLECTED", processed },
			}),
		]);

		return { ok: true, status: 200, data: { rows, total, take, skip } } as const;
	},

	async markTechCashEventProcessed(id: string) {
		const event = await prisma.eventOutbox.findUnique({ where: { id } });
		if (!event)
			return { ok: false, status: 404, message: "Event not found" } as const;
		if (event.topic !== "TECH_PAYMENT_COLLECTED") {
			return {
				ok: false,
				status: 400,
				message: "Not a TECH_PAYMENT_COLLECTED event",
			} as const;
		}
		if (event.processed) {
			return { ok: true, status: 200, data: event } as const;
		}

		const updated = await prisma.eventOutbox.update({
			where: { id },
			data: { processed: true },
		});

		// Also mark the associated booking as PAID if bookingId is present in payload
		const payload = (event as any).payload as any;
		const bookingId = payload?.bookingId as string | undefined;
		if (bookingId) {
			try {
				await prisma.booking.update({
					where: { id: bookingId },
					data: { paymentStatus: "PAID" } as any,
				});
			} catch {
				// best-effort, ignore errors
			}
		}

		return { ok: true, status: 200, data: updated } as const;
	},
};
