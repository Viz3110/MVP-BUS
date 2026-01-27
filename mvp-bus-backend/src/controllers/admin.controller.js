import prisma from "../utils/prisma.js";

// ================= CREATE BUS =================
export const createBus = async (req, res) => {
  try {
    const {
      name,
      from,
      to,
      departure,
      arrival,
      price,
      seats,
      operatorId
    } = req.body;

    // ✅ FIXED validation
    if (
      !name ||
      !from ||
      !to ||
      !departure ||
      !arrival ||
      price === undefined ||
      seats === undefined ||
      operatorId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // auto-generate seat layout
    const seatLayout = Array.from({ length: Number(seats) }, (_, i) => ({
      seatNumber: i + 1,
      booked: false
    }));

    const bus = await prisma.bus.create({
      data: {
        name,
        from,
        to,
        departure,
        arrival,
        price: Number(price),
        seats: Number(seats),
        seatLayout,
        operatorId: Number(operatorId)
      }
    });

    return res.status(201).json({
      success: true,
      bus
    });

  } catch (error) {
    console.error("createBus error:", error);
    return res.status(500).json({ success: false });
  }
};

// ================= UPDATE BUS =================
export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      from,
      to,
      departure,
      arrival,
      price,
      seats
    } = req.body;

    const bus = await prisma.bus.update({
      where: { id: Number(id) }, // ✅ FIXED
      data: {
        name,
        from,
        to,
        departure,
        arrival,
        price: Number(price),
        seats: Number(seats)
      }
    });

    return res.json({ success: true, bus });

  } catch (error) {
    console.error("updateBus error:", error);
    return res.status(500).json({ success: false });
  }
};

// ================= DELETE BUS =================
export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.bus.delete({
      where: { id: Number(id) },
    });

    return res.json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (err) {
    console.error("deleteBus error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= GET ALL BUSES =================
export const getAllBuses = async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      success: true,
      count: buses.length,
      buses,
    });
  } catch (err) {
    console.error("getAllBuses error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= GET SINGLE BUS =================
export const getBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await prisma.bus.findUnique({
      where: { id: Number(id) },
    });

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found"
      });
    }

    return res.status(200).json({
      success: true,
      bus,
    });
  } catch (err) {
    console.error("getBus error:", err);
    return res.status(500).json({ success: false });
  }
};
// ================= GET ALL BOOKINGS =================
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        bus: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("getAllBookings error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= DASHBOARD STATS =================
export const getDashboardStats = async (req, res) => {
  try {
    const [busCount, bookingCount, userCount] = await Promise.all([
      prisma.bus.count(),
      prisma.booking.count(),
      prisma.user.count(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalBuses: busCount,
        totalBookings: bookingCount,
        totalUsers: userCount,
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ success: false });
  }
};
