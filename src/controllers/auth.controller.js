// src/controllers/auth.controller.js

import prisma from "../utils/prisma.js";
import generateOtp from "../utils/generateOtp.js";
import { saveOtp, verifyOtp } from "../utils/otpStore.js";
import jwt from "jsonwebtoken";
import { trackOtpRequest, resetOtpAttempts } from "../utils/otpRateLimit.js";

const normalizePhone = p =>
  p.replace(/\s+/g, "").replace(/^(\+91)?/, "+91");

// ---------------- SEND OTP -----------------
export const sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;
    phone = normalizePhone(phone);

    const otp = generateOtp();
    saveOtp(phone, otp);

    if (process.env.NODE_ENV !== "production") {
      console.log("DEV OTP:", phone, otp);
    }

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
};
const limit = trackOtpRequest(phone);

if (limit.blocked) {
  return res.status(429).json({
    success: false,
    message: "Too many OTP requests. Try again later."
  });
}


// ---------------- VERIFY OTP -----------------
export const verifyOtpCode = async (req, res) => {
  try {
    console.log("VERIFY BODY 👉", req.body);

    let { phone, otp } = req.body;

    phone = normalizePhone(phone);
    otp = String(otp);

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const isValid = verifyOtp(phone, otp);
    console.log("OTP VALID? 👉", isValid);

    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // 🔹 Reset rate-limit after success
    resetOtpAttempts?.(phone);

    let user = await prisma.user.findUnique({
      where: { phone },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { phone }
      });
    }

    const bookingCount = await prisma.booking.count({
      where: { userId: user.id }
    });

    const token = jwt.sign(
      { id: user.id, phone: user.phone },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        lastBooking: user.bookings?.[0] || null,
        bookingCount
      },
      token
    });

  } catch (err) {
    console.error("🔥 verifyOtp error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
};
