import { Request, Response } from "express";
import { geoService } from "../services/geo.service";

export async function geocodeCtrl(req: Request, res: Response) {
  const { q } = req.body || {};
  if (!q) return res.status(400).json({ ok: false, message: "q (address string) required" });
  const data = await geoService.geocodeAddress(q);
  if (!data) return res.status(404).json({ ok: false, message: "Not found" });
  return res.json({ ok: true, data });
}

export async function reverseCtrl(req: Request, res: Response) {
  const { lat, lng } = req.body || {};
  if (typeof lat !== "number" || typeof lng !== "number")
    return res.status(400).json({ ok: false, message: "lat and lng (numbers) required" });
  const data = await geoService.reverseGeocode(lat, lng);
  if (!data) return res.status(404).json({ ok: false, message: "Not found" });
  return res.json({ ok: true, data });
}
