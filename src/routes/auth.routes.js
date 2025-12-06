import { Router } from "express";
import { sendOtp, verifyOtpCode } from "../controllers/auth.controller.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpCode);

export default router;
