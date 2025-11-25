import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  adminListBookingsCtrl,
  adminGetBookingCtrl,
  adminUpdateBookingStatusCtrl,
  adminReassignBookingCtrl,
  adminDispatchBookingCtrl,
} from "../controllers/AdminBooking.controllers";

export const adminBookingRouter = Router();

adminBookingRouter.use(authJwt, requireRole("ADMIN"));

adminBookingRouter.get("/bookings", adminListBookingsCtrl);
adminBookingRouter.get("/bookings/:id", adminGetBookingCtrl);
adminBookingRouter.patch("/bookings/:id/status", adminUpdateBookingStatusCtrl);
adminBookingRouter.post("/bookings/:id/reassign", adminReassignBookingCtrl);
adminBookingRouter.post("/bookings/:id/dispatch", adminDispatchBookingCtrl);
