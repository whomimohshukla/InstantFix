import { Request, Response } from "express";
import { catalogService } from "../services/catalog.service";

export async function categoriesCtrl(_req: Request, res: Response) {
  const data = await catalogService.categories();
  return res.json({ ok: true, data });
}

export async function servicesCtrl(req: Request, res: Response) {
  const { categoryId } = req.query as { categoryId?: string };
  const data = await catalogService.services(categoryId);
  return res.json({ ok: true, data });
}
