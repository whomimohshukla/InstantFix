import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  adminListPaymentsCtrl,
  adminGetPaymentCtrl,
  adminCreateRefundCtrl,
  adminListRefundsCtrl,
  adminGetRefundCtrl,
  adminReconcilePaymentCtrl,
  adminListTechCashEventsCtrl,
  adminMarkTechCashEventProcessedCtrl,
} from "../controllers/AdminPayment.controllers";

export const adminPaymentRouter = Router();

adminPaymentRouter.use(authJwt, requireRole("ADMIN"));

adminPaymentRouter.get("/payments", adminListPaymentsCtrl);
adminPaymentRouter.get("/payments/:id", adminGetPaymentCtrl);
adminPaymentRouter.post("/payments/:id/reconcile", adminReconcilePaymentCtrl);
adminPaymentRouter.post("/refunds", adminCreateRefundCtrl);
adminPaymentRouter.get("/refunds", adminListRefundsCtrl);
adminPaymentRouter.get("/refunds/:id", adminGetRefundCtrl);
adminPaymentRouter.get("/tech-cash-events", adminListTechCashEventsCtrl);
adminPaymentRouter.post(
	"/tech-cash-events/:id/mark-processed",
	adminMarkTechCashEventProcessedCtrl
);
