import prisma from "../utils/prisma.js";

// ================= CREATE TRIP =================
export const createTrip = async (req, res) => {
  try {
    const { routeId, busId, date, startTime, endTime, price } = req.body;

    const bus = await prisma.bus.findUnique({
      where: { id: Number(busId) }
    });

    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const trip = await prisma.trip.create({
      data: {
        routeId: Number(routeId),
        busId: Number(busId),
        date: new Date(date),
        startTime,
        endTime,
        price
      }
    });

    // 🔥 CREATE SEATS FOR THIS TRIP
    const seats = [];
    for (let i = 1; i <= bus.seats; i++) {
      seats.push({
        tripId: trip.id,
        seatNo: `S${i}`
      });
    }

    await prisma.tripSeat.createMany({ data: seats });

    return res.json({ success: true, trip });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
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
// ================= SEARCH TRIPS =================
export const searchTrips = async (req, res) => {
  try {
    console.log("SEARCH PARAMS 👉", req.query);

    const { from, to, date } = req.query;

    // 🔒 Validate query params
    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: "from, to, and date are required",
      });
    }

    // 📅 Build safe date range (no mutation)
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // 🛣️ 1. Find matching routes (case-insensitive)
    const routes = await prisma.route.findMany({
      where: {
        from: { equals: from, mode: "insensitive" },
        to: { equals: to, mode: "insensitive" },
      },
      select: { id: true },
    });

    if (!routes.length) {
      return res.json({
        success: true,
        count: 0,
        trips: [],
      });
    }

    const routeIds = routes.map((r) => r.id);

    // 🚌 2. Find trips for those routes on the given date
    const trips = await prisma.trip.findMany({
      where: {
        routeId: { in: routeIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        bus: true,
        seats: true,
      },
    });

    if (!trips.length) {
      return res.json({
        success: true,
        count: 0,
        trips: [],
      });
    }

    // 🧮 3. Build frontend-ready response
   const result = trips.map((trip) => {
  const totalSeats = trip.bus.seats;
  const bookedSeats = trip.seats.filter((s) => s.booked).length;
  const availableSeats = totalSeats - bookedSeats;

  return {
    id: trip.id,
    busId: trip.busId,
    busName: trip.bus.name,
    departureTime: trip.startTime,
    arrivalTime: trip.endTime,
    price: trip.price,
    totalSeats,
    bookedSeats,
    availableSeats,
  };
});

    // ✅ Final response
    return res.json({
      success: true,
      count: result.length,
      trips: result,
    });
  } catch (err) {
    console.error("searchTrips error 👉", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
