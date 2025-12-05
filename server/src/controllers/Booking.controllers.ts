import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { bookingService } from "../services/booking.service";

export async function createBookingCtrl(req: AuthRequest, res: Response) {
	const result = await bookingService.create(req.user!.id, req.body);
	return res.status(result.status).json(result);
}

export async function listMyBookingsCtrl(req: AuthRequest, res: Response) {
	const result = await bookingService.listMine(req.user!.id, req.query);
	return res.status(result.status).json(result);
}

export async function getMyBookingCtrl(req: AuthRequest, res: Response) {
	const { id } = req.params;
	const result = await bookingService.detail(req.user!.id, id);
	return res.status(result.status).json(result);
}

export async function cancelMyBookingCtrl(req: AuthRequest, res: Response) {
	const { id } = req.params;
	const result = await bookingService.cancel(req.user!.id, id, req.body);
	return res.status(result.status).json(result);
}

export async function rateMyBookingCtrl(req: AuthRequest, res: Response) {
	const { id } = req.params;
	const result = await bookingService.rate(req.user!.id, id, req.body);
	return res.status(result.status).json(result);
}

export async function openMyBookingDisputeCtrl(
	req: AuthRequest,
	res: Response
) {
	const { id } = req.params;
	const result = await bookingService.openDispute(req.user!.id, id, req.body);
	return res.status(result.status).json(result);
}

export async function getMyBookingDisputeCtrl(req: AuthRequest, res: Response) {
	const { id } = req.params;
	const result = await bookingService.getDispute(req.user!.id, id);
	return res.status(result.status).json(result);
}
