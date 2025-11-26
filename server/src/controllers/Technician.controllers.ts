import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { userRepo } from "../repositories/user.repo";
import { prisma } from "../lib/prisma";
import { technicianBookingService } from "../services/technicianBooking.service";
import { technicianOfferService } from "../services/technicianOffer.service";
import { technicianEarningService } from "../services/technicianEarning.service";
import { technicianServiceAreaService } from "../services/technicianServiceArea.service";
import { technicianAvailabilityService } from "../services/technicianAvailability.service";
import { technicianPayoutService } from "../services/technicianPayout.service";

// GET /technician/onboarding/status
export async function getOnboardingStatusCtrl(req: AuthRequest, res: Response) {
	const userId = req.user!.id;
	const profile = await userRepo.getTechnicianProfileByUserId(userId);
	if (!profile)
		return res
			.status(404)
			.json({ ok: false, message: "Technician profile not found" });

	const required = {
		headline: true,
		yearsExperience: true,
		skills: true,
	};
	const completed = Boolean(
		profile.headline &&
			profile.yearsExperience !== undefined &&
			(profile.skills?.length || 0) > 0
	);

	return res.json({ ok: true, status: { completed, required, profile } });
}

// GET /technician/profile (with media)
export async function getMyTechnicianProfileCtrl(
	req: AuthRequest,
	res: Response
) {
	const userId = req.user!.id;
	const profile = await userRepo.getTechnicianProfileByUserId(userId);
	if (!profile)
		return res
			.status(404)
			.json({ ok: false, message: "Technician profile not found" });

	const media = await prisma.media.findMany({
		where: { ownerType: "TECHNICIAN", ownerId: profile.id },
		orderBy: { createdAt: "asc" },
	});

	return res.json({ ok: true, data: { profile, media } });
}

// PUT /technician/onboarding/update
export async function updateOnboardingCtrl(req: AuthRequest, res: Response) {
	const userId = req.user!.id;
	const {
		headline,
		bio,
		yearsExperience,
		skills,
		toolset,
		hasVehicle,
		hourlyRate,
	} = req.body || {};
	try {
		const updated = await userRepo.updateTechnicianProfile(userId, {
			headline: headline ?? null,
			bio: bio ?? null,
			yearsExperience,
			skills,
			toolset,
			hasVehicle,
			hourlyRate: hourlyRate ?? null,
		});
		return res.json({ ok: true, data: updated });
	} catch (e) {
		return res
			.status(400)
			.json({ ok: false, message: "Unable to update profile" });
	}
}

// POST /technician/profile/media
export async function addTechnicianMediaCtrl(req: AuthRequest, res: Response) {
	const userId = req.user!.id;
	const { url, publicId, type, title } = req.body || {};
	if (!url)
		return res
			.status(400)
			.json({ ok: false, message: "url required" });

	const profile = await userRepo.getTechnicianProfileByUserId(userId);
	if (!profile)
		return res
			.status(404)
			.json({ ok: false, message: "Technician profile not found" });

	const media = await prisma.media.create({
		data: {
			ownerType: "TECHNICIAN",
			ownerId: profile.id,
			url,
			publicId,
			type: type || "IMAGE",
			title,
		},
	});

	return res.status(201).json({ ok: true, data: media });
}

// DELETE /technician/profile/media/:mediaId
export async function deleteTechnicianMediaCtrl(
	req: AuthRequest,
	res: Response
) {
	const userId = req.user!.id;
	const { mediaId } = req.params as { mediaId: string };
	const profile = await userRepo.getTechnicianProfileByUserId(userId);
	if (!profile)
		return res
			.status(404)
			.json({ ok: false, message: "Technician profile not found" });

	const deleted = await prisma.media.deleteMany({
		where: {
			id: mediaId,
			ownerType: "TECHNICIAN",
			ownerId: profile.id,
		},
	});
	if (deleted.count === 0)
		return res
			.status(404)
			.json({ ok: false, message: "Media not found" });

	return res.json({ ok: true, message: "Deleted" });
}

// GET /technician/bookings
export async function listMyTechnicianBookingsCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianBookingService.listMyBookings(
		technicianUserId,
		req.query
	);
	return res.status(result.status).json(result);
}

// POST /technician/bookings/:id/cancel
export async function cancelTechnicianBookingCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianBookingService.cancelBooking(
		technicianUserId,
		req.params.id,
		req.body
	);
	return res.status(result.status).json(result);
}

// POST /technician/bookings/:id/payment-collected
export async function technicianPaymentCollectedCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianBookingService.paymentCollected(
		technicianUserId,
		req.params.id,
		req.body
	);
	return res.status(result.status).json(result);
}

// Service areas
// GET /technician/service-areas
export async function listServiceAreasCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianServiceAreaService.list(technicianUserId);
	return res.status(result.status).json(result);
}

// POST /technician/service-areas
export async function createServiceAreaCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianServiceAreaService.upsert(
		technicianUserId,
		req.body
	);
	return res.status(result.status).json(result);
}

// DELETE /technician/service-areas/:id
export async function deleteServiceAreaCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianServiceAreaService.remove(
		technicianUserId,
		req.params.id
	);
	return res.status(result.status).json(result);
}

// Availability
// GET /technician/availability
export async function listAvailabilityCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianAvailabilityService.list(technicianUserId);
	return res.status(result.status).json(result);
}

// POST /technician/availability
export async function setAvailabilityCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianAvailabilityService.set(
		technicianUserId,
		req.body
	);
	return res.status(result.status).json(result);
}

// GET /technician/payouts
export async function listPayoutsCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianPayoutService.list(
		technicianUserId,
		req.query
	);
	return res.status(result.status).json(result);
}

// GET /technician/bookings/:id
export async function getMyTechnicianBookingCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianBookingService.getMyBooking(
		technicianUserId,
		req.params.id
	);
	return res.status(result.status).json(result);
}

// GET /technician/offers
export async function listMyOffersCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianOfferService.listMyOffers(technicianUserId);
	return res.status(result.status).json(result);
}

// POST /technician/offers/:id/accept
export async function acceptOfferCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianOfferService.acceptOffer(
		technicianUserId,
		req.params.id
	);
	return res.status(result.status).json(result);
}

// POST /technician/offers/:id/reject
export async function rejectOfferCtrl(req: AuthRequest, res: Response) {
	const technicianUserId = req.user!.id;
	const result = await technicianOfferService.rejectOffer(
		technicianUserId,
		req.params.id
	);
	return res.status(result.status).json(result);
}

// POST /technician/bookings/:id/status
export async function updateTechnicianBookingStatusCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianBookingService.updateStatus(
		technicianUserId,
		req.params.id,
		req.body
	);
	return res.status(result.status).json(result);
}

// GET /technician/earnings/summary
export async function technicianEarningsSummaryCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianEarningService.summary(technicianUserId);
	return res.status(result.status).json(result);
}

// GET /technician/earnings
export async function technicianEarningsListCtrl(
	req: AuthRequest,
	res: Response
) {
	const technicianUserId = req.user!.id;
	const result = await technicianEarningService.list(
		technicianUserId,
		req.query
	);
	return res.status(result.status).json(result);
}

