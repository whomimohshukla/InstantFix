import { adminPaymentRepo } from "../repositories/adminPayment.repo";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

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
};
