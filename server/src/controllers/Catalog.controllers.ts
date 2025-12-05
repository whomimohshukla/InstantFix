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

export async function serviceDetailCtrl(req: Request, res: Response) {
	const { id } = req.params as { id: string };
	const data = await catalogService.serviceDetail(id);
	if (!data) return res.status(404).json({ ok: false, message: "Not found" });
	return res.json({ ok: true, data });
}
