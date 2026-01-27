import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  markBookingPaid,
  getTripSeats,
  lockSeat,
  confirmBooking,
  getMyBookings
} from "../controllers/booking.controller.js";
import userAuth from "../middlewares/userAuth.js";

const router = Router();

/* BOOKINGS */
router.post("/create", userAuth, createBooking);
router.post("/confirm/:id", userAuth, confirmBooking);
router.put("/cancel/:id", userAuth, cancelBooking);
router.put("/pay/:id", userAuth, markBookingPaid);

/* USER */
router.get("/user/:userId", userAuth, getUserBookings);
router.get("/my", userAuth, getMyBookings);
router.get("/:id", userAuth, getBookingDetails);

/* SEATS */
router.get("/trip/:tripId/seats", getTripSeats);
router.post("/lock-seat", userAuth, lockSeat);

export default router;
