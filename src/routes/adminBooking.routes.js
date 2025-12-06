import { Router } from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getAllBookings,
  getBookingDetails,
  cancelBooking
} from "../controllers/adminBooking.controller.js";

const router = Router();

router.get("/", adminAuth, getAllBookings);
router.get("/:id", adminAuth, getBookingDetails);
router.put("/cancel/:id", adminAuth, cancelBooking);

export default router;
