import { Request, Response } from "express";
import { adminUserService } from "../services/adminUser.service";
import { logAdminAction } from "../services/audit.service";

export const adminListUsersCtrl = async (req: Request, res: Response) => {
  const result = await adminUserService.listUsers(req.query);
  res.status(result.status).json(result);
};

export const adminUpdateUserStatusCtrl = async (req: Request, res: Response) => {
  const result = await adminUserService.updateStatus(req.params.id, req.body);
  if (result.ok) {
    const actorId = (req as any).user?.id as string;
    await logAdminAction({
      actorId,
      entityType: "User",
      entityId: req.params.id,
      action: "UPDATE_STATUS",
      diff: req.body,
    });
  }
  res.status(result.status).json(result);
};
