import prisma from "../utils/prisma.js";
import generateOtp from "../utils/generateOtp.js";
import { saveOtp, verifyOtp } from "../utils/otpStore.js";
import jwt from "jsonwebtoken";

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: "Phone required" });

    const otp = generateOtp();
    saveOtp(phone, otp);

    return res.json({
      success: true,
      message: "OTP generated",
      otp // 👉 MVP ONLY — remove later
    });

  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ success: false });
  }
};


export const verifyOtpCode = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ success: false, message: "Missing data" });

    const isValid = verifyOtp(phone, otp);

    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Check user exists
    let user = await prisma.user.findUnique({ where: { phone } });

    // If new user → create
    if (!user) {
      user = await prisma.user.create({
        data: { phone }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      user,
      token
    });

  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ success: false });
  }
};
