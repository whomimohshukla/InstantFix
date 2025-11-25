import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { createRazorpayOrderCtrl } from "../controllers/Payment.controllers";

export const paymentRouter = Router();

paymentRouter.use(authJwt, requireRole("CUSTOMER"));

paymentRouter.post("/razorpay/order", createRazorpayOrderCtrl);
