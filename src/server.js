import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import busRoutes from "./routes/bus.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import searchRoutes from "./routes/search.routes.js";
import { releaseExpiredSeatLocks } from "./jobs/seatUnlocker.js";

import adminRoutes from "./routes/admin.routes.js";
import adminBusRoutes from "./routes/adminBus.routes.js";
import adminBookingRoutes from "./routes/adminBooking.routes.js";
import adminTripRoutes from "./routes/adminTrip.routes.js";
import adminTravellerRoutes from "./routes/adminTraveller.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// ===== USER =====
app.use("/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/search", searchRoutes);

// ===== ADMIN =====
app.use("/api/admin", adminRoutes);
app.use("/api/admin/buses", adminBusRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/trips", adminTripRoutes);
app.use("/api/admin/travellers", adminTravellerRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// ================= SERVER =================
const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

// Auto-unlock expired seat locks
setInterval(releaseExpiredSeatLocks, 60 * 1000); // every 1 min

console.log("⏱️ Seat-lock cleanup scheduler running…");


