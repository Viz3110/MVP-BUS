// src/routes/auth.routes.js
import { googleLogin } from "../controllers/google.controller.js";
import { Router } from "express";
import { sendOtp, verifyOtpCode } from "../controllers/auth.controller.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpCode);
router.post("/google-login", googleLogin);

export default router;
