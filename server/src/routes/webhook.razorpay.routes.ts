import { Router } from "express";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

export const razorpayWebhookRouter = Router();

razorpayWebhookRouter.post("/razorpay", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret)
    return res.status(500).json({ ok: false, message: "Webhook secret missing" });

  const body = JSON.stringify(req.body);
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (!signature || signature !== expected)
    return res.status(400).json({ ok: false, message: "Invalid signature" });

  const event = req.body;

  try {
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id as string | undefined;
      const amount = paymentEntity?.amount as number | undefined;

      if (orderId) {
        await prisma.payment.updateMany({
          where: { provider: PaymentProvider.RAZORPAY, providerId: orderId },
          data: { status: PaymentStatus.SUCCEEDED, amount: amount ?? undefined },
        });

        const payment = await prisma.payment.findFirst({
          where: { provider: PaymentProvider.RAZORPAY, providerId: orderId },
        });

        if (payment) {
          await prisma.booking.updateMany({
            where: { id: payment.bookingId, status: "PENDING" },
            data: { status: "CONFIRMED" },
          });
        }
      }
    }

    if (event.event === "payment.failed") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id as string | undefined;
      if (orderId) {
        await prisma.payment.updateMany({
          where: { provider: PaymentProvider.RAZORPAY, providerId: orderId },
          data: { status: PaymentStatus.FAILED },
        });
      }
    }

    if (event.event === "refund.processed") {
      const refundEntity = event.payload?.refund?.entity;
      const paymentId = refundEntity?.payment_id as string | undefined;
      const amount = refundEntity?.amount as number | undefined;

      if (paymentId && amount) {
        const payment = await prisma.payment.findFirst({
          where: { provider: PaymentProvider.RAZORPAY, providerId: paymentId },
        });
        if (payment) {
          await prisma.refund.create({
            data: {
              paymentId: payment.id,
              amount,
              reason: refundEntity?.notes?.reason ?? null,
            },
          });
        }
      }
    }
  } catch (e) {
    console.error("[Razorpay webhook] error", e);
    return res.status(500).json({ ok: false, message: "Webhook handling error" });
  }

  return res.json({ ok: true });
});
