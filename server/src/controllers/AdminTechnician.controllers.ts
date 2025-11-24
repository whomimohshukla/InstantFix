import { Request, Response } from "express";
import { adminTechnicianService } from "../services/adminTechnician.service";
import { logAdminAction } from "../services/audit.service";

export const adminListVerificationRequestsCtrl = async (req: Request, res: Response) => {
  const result = await adminTechnicianService.listVerificationRequests(req.query);
  res.status(result.status).json(result);
};

export const adminGetVerificationRequestCtrl = async (req: Request, res: Response) => {
  const result = await adminTechnicianService.getVerificationRequest(req.params.id);
  res.status(result.status).json(result);
};

export const adminReviewVerificationRequestCtrl = async (req: Request, res: Response) => {
  const reviewerId = (req as any).user?.id as string;
  const result = await adminTechnicianService.reviewVerificationRequest(req.params.id, reviewerId, req.body);
  if (result.ok) {
    await logAdminAction({
      actorId: reviewerId,
      entityType: "VerificationRequest",
      entityId: req.params.id,
      action: `REVIEW_${(req.body?.action || "").toString().toUpperCase()}`,
      diff: req.body,
    });
  }
  res.status(result.status).json(result);
};
