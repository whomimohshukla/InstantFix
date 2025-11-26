import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
	getOnboardingStatusCtrl,
	updateOnboardingCtrl,
	getMyTechnicianProfileCtrl,
	addTechnicianMediaCtrl,
	deleteTechnicianMediaCtrl,
	listMyTechnicianBookingsCtrl,
	getMyTechnicianBookingCtrl,
	listMyOffersCtrl,
	acceptOfferCtrl,
	rejectOfferCtrl,
	updateTechnicianBookingStatusCtrl,
	cancelTechnicianBookingCtrl,
	technicianPaymentCollectedCtrl,
	technicianEarningsSummaryCtrl,
	technicianEarningsListCtrl,
	listServiceAreasCtrl,
	createServiceAreaCtrl,
	deleteServiceAreaCtrl,
	listAvailabilityCtrl,
	setAvailabilityCtrl,
	listPayoutsCtrl,
} from "../controllers/Technician.controllers";

export const technicianRouter = Router();

technicianRouter.use(authJwt, requireRole("TECHNICIAN"));

// Onboarding
technicianRouter.get("/onboarding/status", getOnboardingStatusCtrl);
technicianRouter.post("/onboarding/update", updateOnboardingCtrl);

// Profile & media
technicianRouter.get("/profile", getMyTechnicianProfileCtrl);
technicianRouter.post("/profile/media", addTechnicianMediaCtrl);
technicianRouter.delete("/profile/media/:mediaId", deleteTechnicianMediaCtrl);

// My bookings
technicianRouter.get("/bookings", listMyTechnicianBookingsCtrl);
technicianRouter.get("/bookings/:id", getMyTechnicianBookingCtrl);
technicianRouter.post("/bookings/:id/status", updateTechnicianBookingStatusCtrl);
technicianRouter.post("/bookings/:id/cancel", cancelTechnicianBookingCtrl);
technicianRouter.post(
	"/bookings/:id/payment-collected",
	technicianPaymentCollectedCtrl
);

// Earnings
technicianRouter.get("/earnings/summary", technicianEarningsSummaryCtrl);
technicianRouter.get("/earnings", technicianEarningsListCtrl);

// Service areas
technicianRouter.get("/service-areas", listServiceAreasCtrl);
technicianRouter.post("/service-areas", createServiceAreaCtrl);
technicianRouter.delete("/service-areas/:id", deleteServiceAreaCtrl);

// Availability
technicianRouter.get("/availability", listAvailabilityCtrl);
technicianRouter.post("/availability", setAvailabilityCtrl);

// Payouts
technicianRouter.get("/payouts", listPayoutsCtrl);

// Dispatch offers
technicianRouter.get("/offers", listMyOffersCtrl);
technicianRouter.post("/offers/:id/accept", acceptOfferCtrl);
technicianRouter.post("/offers/:id/reject", rejectOfferCtrl);

export default technicianRouter;
