import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { getOnboardingStatusCtrl, updateOnboardingCtrl } from "../controllers/Technician.controllers";

export const technicianRouter = Router();

technicianRouter.use(authJwt, requireRole("TECHNICIAN"));

technicianRouter.get("/onboarding/status", getOnboardingStatusCtrl);
technicianRouter.post("/onboarding/update", updateOnboardingCtrl);

export default technicianRouter;
