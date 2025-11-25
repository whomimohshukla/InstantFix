import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

export const createRazorpayOrderCtrl = async (req: Request, res: Response) => {
  const { bookingId } = req.body || {};
  if (!bookingId)
    return res.status(400).json({ ok: false, message: "bookingId required" });
  const result = await paymentService.createRazorpayOrderForBooking({ bookingId });
  return res.status(result.status).json(result);
};
