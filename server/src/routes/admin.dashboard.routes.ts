import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { adminDashboardSummaryCtrl, adminDashboardTimeseriesCtrl } from "../controllers/AdminDashboard.controllers";

export const adminDashboardRouter = Router();

adminDashboardRouter.use(authJwt, requireRole("ADMIN"));

adminDashboardRouter.get("/dashboard/summary", adminDashboardSummaryCtrl);
adminDashboardRouter.get("/dashboard/timeseries", adminDashboardTimeseriesCtrl);
