import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  adminListDisputesCtrl,
  adminGetDisputeCtrl,
  adminResolveDisputeCtrl,
} from "../controllers/AdminDispute.controllers";

export const adminDisputeRouter = Router();

adminDisputeRouter.use(authJwt, requireRole("ADMIN"));

adminDisputeRouter.get("/disputes", adminListDisputesCtrl);
adminDisputeRouter.get("/disputes/:id", adminGetDisputeCtrl);
adminDisputeRouter.post("/disputes/:id/resolve", adminResolveDisputeCtrl);
