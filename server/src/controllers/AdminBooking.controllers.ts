import { Request, Response } from "express";
import { adminBookingService } from "../services/adminBooking.service";
import { adminDispatchService } from "../services/adminDispatch.service";
import { logAdminAction } from "../services/audit.service";

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
  if (result.ok) {
    const actorId = (req as any).user?.id as string;
    await logAdminAction({
      actorId,
      entityType: "Booking",
      entityId: req.params.id,
      action: "UPDATE_STATUS",
      diff: req.body,
    });
  }
  res.status(result.status).json(result);
};

export const adminDispatchBookingCtrl = async (req: Request, res: Response) => {
  const result = await adminDispatchService.dispatchForBooking(
    req.params.id,
    req.body
  );
  if (result.ok) {
    const actorId = (req as any).user?.id as string;
    await logAdminAction({
      actorId,
      entityType: "Booking",
      entityId: req.params.id,
      action: "DISPATCH_OFFERS",
      diff: req.body,
    });
  }
  res.status(result.status).json(result);
};

export const adminReassignBookingCtrl = async (req: Request, res: Response) => {
  const result = await adminBookingService.reassign(req.params.id, req.body);
  if (result.ok) {
    const actorId = (req as any).user?.id as string;
    await logAdminAction({
      actorId,
      entityType: "Booking",
      entityId: req.params.id,
      action: "REASSIGN_TECHNICIAN",
      diff: req.body,
    });
  }
  res.status(result.status).json(result);
};
