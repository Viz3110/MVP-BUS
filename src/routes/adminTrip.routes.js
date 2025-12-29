import { Router } from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/adminTrip.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = Router();

router.post("/", adminAuth, createTrip);
router.get("/", adminAuth, getAllTrips);
router.get("/:id", adminAuth, getTripById);
router.put("/:id", adminAuth, updateTrip);
router.delete("/:id", adminAuth, deleteTrip);

export default router;
