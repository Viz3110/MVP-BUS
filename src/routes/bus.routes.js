import { Router } from "express";
import { searchBuses, getBusSeats } from "../controllers/bus.controller.js";

const router = Router();

router.get("/search", searchBuses);
router.get("/:id/seats", getBusSeats);

export default router;
