import { Router } from "express";
import { authJwt, requireRole } from "../middlewares/auth";
import {
  createBookingCtrl,
  listMyBookingsCtrl,
  getMyBookingCtrl,
} from "../controllers/Booking.controllers";

export const bookingRouter = Router();

bookingRouter.use(authJwt, requireRole("CUSTOMER"));

bookingRouter.post("/", createBookingCtrl);
bookingRouter.get("/me", listMyBookingsCtrl);
bookingRouter.get("/me/:id", getMyBookingCtrl);
