import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { adminListUsersCtrl, adminUpdateUserStatusCtrl } from "../controllers/AdminUser.controllers";

export const adminUserRouter = Router();

adminUserRouter.use(authJwt, requireRole("ADMIN"));

adminUserRouter.get("/users", adminListUsersCtrl);
adminUserRouter.patch("/users/:id/status", adminUpdateUserStatusCtrl);
