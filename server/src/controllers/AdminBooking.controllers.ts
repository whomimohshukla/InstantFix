import { Request, Response } from "express";
import { adminBookingService } from "../services/adminBooking.service";

export const adminListBookingsCtrl = async (req: Request, res: Response) => {
  const result = await adminBookingService.list(req.query);
  res.status(result.status).json(result);
};

export const adminGetBookingCtrl = async (req: Request, res: Response) => {
  const result = await adminBookingService.get(req.params.id);
  res.status(result.status).json(result);
};

export const adminUpdateBookingStatusCtrl = async (req: Request, res: Response) => {
  const result = await adminBookingService.updateStatus(req.params.id, req.body);
  res.status(result.status).json(result);
};

export const adminReassignBookingCtrl = async (req: Request, res: Response) => {
  const result = await adminBookingService.reassign(req.params.id, req.body);
  res.status(result.status).json(result);
};
