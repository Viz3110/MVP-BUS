import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  markBookingPaid,
  searchTrips,
  getTripSeats,
  lockSeat,
  confirmBooking,
  getMyBookings
} from "../controllers/booking.controller.js";
import userAuth from "../middlewares/userAuth.js";

const router = Router();

router.post("/create", userAuth, createBooking);
router.get("/user/:userId",userAuth, getUserBookings);
router.get("/:id",userAuth, getBookingDetails);
router.put("/cancel/:id",userAuth, cancelBooking);  
router.put("/pay/:id",userAuth, markBookingPaid);
router.post("/search", searchTrips);
router.get("/trip/:tripId/seats", getTripSeats);
router.post("/lock-seat", lockSeat);
router.post("/confirm", confirmBooking);
router.get("/my", getMyBookings);

export default router;
