import { Request, Response } from "express";
import { adminNotificationService } from "../services/adminNotification.service";

export const adminSendNotificationToUserCtrl = async (req: Request, res: Response) => {
  const result = await adminNotificationService.sendToUser(req.body);
  res.status(result.status).json(result);
};

export const adminBroadcastNotificationCtrl = async (req: Request, res: Response) => {
  const result = await adminNotificationService.broadcast(req.body);
  res.status(result.status).json(result);
};
