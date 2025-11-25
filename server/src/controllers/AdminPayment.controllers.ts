import { Request, Response } from "express";
import { adminPaymentService } from "../services/adminPayment.service";
import { logAdminAction } from "../services/audit.service";

export const adminListPaymentsCtrl = async (req: Request, res: Response) => {
  const result = await adminPaymentService.list(req.query);
  res.status(result.status).json(result);
};

export const adminGetPaymentCtrl = async (req: Request, res: Response) => {
  const result = await adminPaymentService.get(req.params.id);
  res.status(result.status).json(result);
};

export const adminCreateRefundCtrl = async (req: Request, res: Response) => {
  const result = await adminPaymentService.createRefund(req.body);
  if (result.ok) {
    const actorId = (req as any).user?.id as string;
    await logAdminAction({
      actorId,
      entityType: "Refund",
      entityId: (result as any).data.id,
      action: "CREATE",
      diff: req.body,
    });
  }
  res.status(result.status).json(result);
};

export const adminListRefundsCtrl = async (req: Request, res: Response) => {
  const result = await adminPaymentService.listRefunds(req.query);
  res.status(result.status).json(result);
};

export const adminGetRefundCtrl = async (req: Request, res: Response) => {
  const result = await adminPaymentService.getRefund(req.params.id);
  res.status(result.status).json(result);
};

export const adminReconcilePaymentCtrl = async (req: Request, res: Response) => {
  const result = await adminPaymentService.reconcile(req.params.id);
  res.status(result.status).json(result);
};
