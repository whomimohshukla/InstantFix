import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { userRepo } from "../repositories/user.repo";



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


// PUT /technician/onboarding

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

