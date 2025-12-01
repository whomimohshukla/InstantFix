import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { addressService } from "../services/address.service";

export async function listAddressesCtrl(req: AuthRequest, res: Response) {
	const data = await addressService.list(req.user!.id);
	return res.json({ ok: true, data });
}

export async function createAddressCtrl(req: AuthRequest, res: Response) {
	const result = await addressService.create(req.user!.id, req.body);
	return res.status(result.status).json(result);
}

export async function updateAddressCtrl(req: AuthRequest, res: Response) {
	const { id } = req.params;
	const result = await addressService.update(req.user!.id, id, req.body);
	return res.status(result.status).json(result);
}

export async function deleteAddressCtrl(req: AuthRequest, res: Response) {
	const { id } = req.params;
	const result = await addressService.remove(req.user!.id, id);
	return res.status(result.status).json(result);
}
