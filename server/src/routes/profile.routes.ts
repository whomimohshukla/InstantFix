import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { getMyProfileCtrl, updateMyProfileCtrl } from "../controllers/Profile.controllers";

export const profileRouter = Router();

profileRouter.use(authJwt, requireRole("CUSTOMER"));

profileRouter.get("/profile", getMyProfileCtrl);
profileRouter.patch("/profile", updateMyProfileCtrl);
