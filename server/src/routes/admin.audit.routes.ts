import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { adminListAuditLogsCtrl } from "../controllers/AdminAudit.controllers";

export const adminAuditRouter = Router();

adminAuditRouter.use(authJwt, requireRole("ADMIN"));

adminAuditRouter.get("/audit-logs", adminListAuditLogsCtrl);
