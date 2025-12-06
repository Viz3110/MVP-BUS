import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  markBookingPaid
} from "../controllers/booking.controller.js";

const router = Router();

router.post("/create", createBooking);
router.get("/user/:userId", getUserBookings);
router.get("/:id", getBookingDetails);
router.put("/cancel/:id", cancelBooking);  
router.put("/pay/:id", markBookingPaid);



export default router;
