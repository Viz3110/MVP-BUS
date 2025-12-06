import { Router } from "express";
import {
  createTrip,
  searchTrips,
  getTripDetails,
  lockSeats,
  unlockSeats
} from "../controllers/trip.controller.js";

const router = Router();

router.post("/", createTrip);           // Admin create trip
router.get("/search", searchTrips);     // User searches trips
router.get("/:id", getTripDetails);     // Trip details
router.post("/lock", lockSeats);
router.post("/unlock", unlockSeats);

export default router;
