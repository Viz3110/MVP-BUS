import prisma from "../utils/prisma.js";

// ================= CREATE TRIP =================
export const createTrip = async (req, res) => {
  try {
    const { busId, date, departureTime, arrivalTime, price } = req.body;

    if (!busId || !date || !departureTime || !arrivalTime || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const trip = await prisma.trip.create({
      data: {
        busId: Number(busId),
        date: new Date(date),
        departureTime,
        arrivalTime,
        price,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip,
    });
  } catch (err) {
    console.error("createTrip error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= GET ALL TRIPS =================
export const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        bus: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    console.error("getTrips error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= GET SINGLE TRIP =================
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id: Number(id) },
      include: {
        bus: true,
      },
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      success: true,
      trip,
    });
  } catch (err) {
    console.error("getTripById error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= UPDATE TRIP =================
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.update({
      where: { id: Number(id) },
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      trip,
    });
  } catch (err) {
    console.error("updateTrip error:", err);
    return res.status(500).json({ success: false });
  }
};

// ================= DELETE TRIP =================
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.trip.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (err) {
    console.error("deleteTrip error:", err);
    return res.status(500).json({ success: false });
  }
};
