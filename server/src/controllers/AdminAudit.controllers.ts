import { Request, Response } from "express";
import { adminAuditService } from "../services/adminAudit.service";

export const adminListAuditLogsCtrl = async (req: Request, res: Response) => {
  const result = await adminAuditService.list(req.query);
  res.status(result.status).json(result);
};
