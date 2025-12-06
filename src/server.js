import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import busRoutes from "./routes/bus.routes.js";
import dotenv from "dotenv";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import adminBusRoutes from "./routes/adminBus.routes.js";
import adminBookingRoutes from "./routes/adminBooking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import searchRoutes from "./routes/search.routes.js";
import tripRoutes from "./routes/trip.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/buses", busRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/admin/buses", adminBusRoutes);
app.use("/admin/bookings", adminBookingRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/api/trips", tripRoutes);

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
