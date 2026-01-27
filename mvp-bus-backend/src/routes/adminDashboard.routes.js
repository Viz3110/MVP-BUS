import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import prisma from "../utils/prisma.js";

const router = express.Router();

router.get("/", adminAuth, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();

    const revenue = await prisma.booking.aggregate({
      _sum: { price: true },
      where: { paymentStatus: "PAID" }
    });

    const totalTrips = await prisma.trip.count();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalTrips,
        totalRevenue: revenue._sum.price || 0
      }
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;
