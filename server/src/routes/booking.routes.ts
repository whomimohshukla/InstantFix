import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  createBookingCtrl,
  listMyBookingsCtrl,
  getMyBookingCtrl,
  cancelMyBookingCtrl,
  rateMyBookingCtrl,
  openMyBookingDisputeCtrl,
  getMyBookingDisputeCtrl,
} from "../controllers/Booking.controllers";

export const bookingRouter = Router();

bookingRouter.use(authJwt, requireRole("CUSTOMER"));

bookingRouter.post("/", createBookingCtrl);
bookingRouter.get("/me", listMyBookingsCtrl);
bookingRouter.get("/me/:id", getMyBookingCtrl);
bookingRouter.post("/:id/cancel", cancelMyBookingCtrl);
bookingRouter.post("/:id/rating", rateMyBookingCtrl);
bookingRouter.post("/:id/dispute", openMyBookingDisputeCtrl);
bookingRouter.get("/:id/dispute", getMyBookingDisputeCtrl);
