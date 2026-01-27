import prisma from "../utils/prisma.js";

export const searchTrips = async (req, res) => {
  try {
    console.log("SEARCH PARAMS 👉", req.query);

    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: "from, to, and date are required",
      });
    }

    // ✅ FIXED DATE RANGE (NO MUTATION)
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    // 1️⃣ Find matching routes (case-insensitive)
    const routes = await prisma.route.findMany({
      where: {
        from: { equals: from, mode: "insensitive" },
        to: { equals: to, mode: "insensitive" },
      },
      select: { id: true },
    });

    if (!routes.length) {
      return res.json({ success: true, trips: [] });
    }

    const routeIds = routes.map((r) => r.id);

    // 2️⃣ Find trips for those routes on selected date
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
      return res.json({ success: true, trips: [] });
    }

const result = trips.map((trip) => {
  const totalSeats = trip.bus.seats;
  const bookedSeats = trip.seats.filter((s) => s.booked).length;
  const availableSeats = totalSeats - bookedSeats; // ✅ MISSING LINE

  return {
    id: trip.id,
    busId: trip.busId,
    busName: trip.bus.name,
    price: trip.price,

    // ✅ These are CORRECT
    departureTime: trip.startTime,
    arrivalTime: trip.endTime,

    totalSeats,
    bookedSeats,
    availableSeats,
  };
});
    // 4️⃣ Save search log (non-blocking)
    await prisma.searchLog.create({
      data: { from, to, date },
    });

    return res.json({
      success: true,
      count: result.length,
      trips: result,
    });
  } catch (err) {
    console.error("searchTrips error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

