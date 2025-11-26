import { Request, Response } from "express";
import { adminDisputeService } from "../services/adminDispute.service";

export const adminListDisputesCtrl = async (req: Request, res: Response) => {
  const result = await adminDisputeService.list(req.query);
  res.status(result.status).json(result);
};

export const adminGetDisputeCtrl = async (req: Request, res: Response) => {
  const result = await adminDisputeService.get(req.params.id);
  res.status(result.status).json(result);
};

export const adminResolveDisputeCtrl = async (req: Request, res: Response) => {
  const adminUserId = (req as any).user?.id as string;
  const result = await adminDisputeService.resolve(req.params.id, req.body, adminUserId);
  res.status(result.status).json(result);
};
