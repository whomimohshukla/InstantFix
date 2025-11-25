import { razorpayClient } from "../config/razorpay";
import { prisma } from "../lib/prisma";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

export const paymentService = {
  async createRazorpayOrderForBooking({ bookingId }: { bookingId: string }) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });
    if (!booking) return { ok: false, status: 404, message: "Booking not found" } as const;

    let price = booking.priceFinal ?? booking.priceQuoted ?? null;
    if (price == null) {
      const basePrice = booking.service?.basePrice ?? null;
      if (basePrice == null)
        return { ok: false, status: 400, message: "Booking has no price set" } as const;
      // Persist the resolved price onto the booking so future reads are consistent
      await prisma.booking.update({
        where: { id: booking.id },
        data: { priceFinal: basePrice },
      });
      price = basePrice;
    }

    const amountInPaise = price * 100;

    const order = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: booking.id,
    });

    const payment = await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: PaymentProvider.RAZORPAY,
        providerId: order.id,
        amount: amountInPaise,
        currency: "INR",
        status: PaymentStatus.INITIATED,
      },
    });

    return {
      ok: true,
      status: 200,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        paymentId: payment.id,
      },
    } as const;
  },
};
