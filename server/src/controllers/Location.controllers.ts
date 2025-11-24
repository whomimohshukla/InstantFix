import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { liveLocationService } from "../services/liveLocation.service";

export async function updateMyLocationCtrl(req: AuthRequest, res: Response) {
  const { lat, lng, accuracy } = req.body || {};
  if (typeof lat !== "number" || typeof lng !== "number")
    return res.status(400).json({ ok: false, message: "lat and lng required" });
  const data = await liveLocationService.setUserLocation(req.user!.id, { lat, lng, accuracy });
  return res.json({ ok: true, data });
}

export async function getTechnicianLocationCtrl(req: AuthRequest, res: Response) {
  const { technicianUserId } = req.params as { technicianUserId: string };
  if (req.user!.role !== "ADMIN") {
    const allowed = await liveLocationService.customerCanViewTechnician(req.user!.id, technicianUserId);
    if (!allowed) return res.status(403).json({ ok: false, message: "Forbidden" });
  }
  const data = await liveLocationService.getUserLocation(technicianUserId);
  if (!data) return res.status(404).json({ ok: false, message: "No live location" });
  return res.json({ ok: true, data });
}
