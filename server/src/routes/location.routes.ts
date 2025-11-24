import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import { updateMyLocationCtrl, getTechnicianLocationCtrl } from "../controllers/Location.controllers";

export const locationRouter = Router();

locationRouter.use(authJwt);

locationRouter.put("/me/location", updateMyLocationCtrl);
locationRouter.get("/technician/:technicianUserId/location", requireRole("CUSTOMER", "ADMIN"), getTechnicianLocationCtrl);
