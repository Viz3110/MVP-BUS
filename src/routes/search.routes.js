import { Router } from "express";
import { searchTrips } from "../controllers/search.controller.js";

const router = Router();

router.get("/trips", searchTrips);

export default router;
