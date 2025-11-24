import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  adminListVerificationRequestsCtrl,
  adminGetVerificationRequestCtrl,
  adminReviewVerificationRequestCtrl,
} from "../controllers/AdminTechnician.controllers";

export const adminTechnicianRouter = Router();

adminTechnicianRouter.use(authJwt, requireRole("ADMIN"));

adminTechnicianRouter.get("/verifications", adminListVerificationRequestsCtrl);
adminTechnicianRouter.get("/verifications/:id", adminGetVerificationRequestCtrl);
adminTechnicianRouter.post("/verifications/:id/review", adminReviewVerificationRequestCtrl);
