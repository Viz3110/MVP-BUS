import { Router } from "express";
import { adminLogin } from "../controllers/adminAuth.controller.js";
import {
  getAllBuses,
  getBus,
  createBus,
  updateBus,
  deleteBus,
  getAllBookings,
  getDashboardStats
} from "../controllers/admin.controller.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = Router();

// Auth
router.post("/login", adminLogin);

// Bus CRUD
router.get("/buses", adminAuth, getAllBuses);
router.get("/buses/:id", adminAuth, getBus);
router.post("/buses", adminAuth, createBus);
router.put("/buses/:id", adminAuth, updateBus);
router.delete("/buses/:id", adminAuth, deleteBus);

// Bookings list
router.get("/bookings", adminAuth, getAllBookings);

// Dashboard summary
router.get("/dashboard", adminAuth, getDashboardStats);

export default router;
