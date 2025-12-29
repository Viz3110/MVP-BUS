import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  getAllTrips,
  createTrip,
  deleteTrip,
} from "../controllers/adminTrip.controller.js";

const router = express.Router();

router.get("/", adminAuth, getAllTrips);
router.post("/", adminAuth, createTrip);
router.delete("/:id", adminAuth, deleteTrip);

export default router;
