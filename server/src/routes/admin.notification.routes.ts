import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { adminSendNotificationToUserCtrl, adminBroadcastNotificationCtrl } from "../controllers/AdminNotification.controllers";

export const adminNotificationRouter = Router();

adminNotificationRouter.use(authJwt, requireRole("ADMIN"));

adminNotificationRouter.post("/notifications/send", adminSendNotificationToUserCtrl);
adminNotificationRouter.post("/notifications/broadcast", adminBroadcastNotificationCtrl);
