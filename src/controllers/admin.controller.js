import prisma from "../utils/prisma.js";

// ================= CREATE BUS =================
export const createBus = async (req, res) => {
  try {
    const { busNumber, busName, from, to, totalSeats, type } = req.body;

    if (!busNumber || !busName || !from || !to || !totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const bus = await prisma.bus.create({
      data: {
        busNumber,
        busName,
        from,
        to,
        totalSeats,
        type,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Bus created successfully",
      bus,
    });
  } catch (err) {
    console.error("createBus error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= UPDATE BUS =================
export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await prisma.bus.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.json({ success: true, bus });
  } catch (err) {
    console.error("updateBus error:", err);
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
// ================= GET ALL BUSES =================
export const getAllBuses = async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
      return res
        .status(404)
        .json({ success: false, message: "Bus not found" });
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
