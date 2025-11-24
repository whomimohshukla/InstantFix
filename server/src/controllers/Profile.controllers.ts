import { Request, Response } from "express";
import { profileService } from "../services/profile.service";

export const getMyProfileCtrl = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  const result = await profileService.getMyProfile(userId);
  res.status(result.status).json(result);
};

export const updateMyProfileCtrl = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id as string;
  const result = await profileService.updateMyProfile(userId, req.body);
  res.status(result.status).json(result);
};
