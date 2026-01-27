import prisma from "../utils/prisma.js";

export const searchTrips = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: "from, to, and date are required"
      });
    }

    // Convert date → Date object for Trip model
    const searchDate = new Date(date);

    // 1️⃣ Find matching routes
    const routes = await prisma.route.findMany({
      where: { from, to },
      include: { trips: true }
    });

    if (!routes.length) {
      return res.json({ success: true, trips: [] });
    }

    // 2️⃣ Collect trips happening on the selected date
    const trips = await prisma.trip.findMany({
      where: {
        date: {
          gte: new Date(searchDate.setHours(0, 0, 0)),
          lt: new Date(searchDate.setHours(23, 59, 59)),
        }
      },
      include: {
        bus: true,
        seats: true,  // TripSeat[]
      }
    });

    if (!trips.length) {
      return res.json({ success: true, trips: [] });
    }

    // 3️⃣ Build response: calculate available seats
    const result = trips.map((trip) => {
      const totalSeats = trip.bus.seats;
      const bookedSeats = trip.seats.filter(s => s.booked === true).length;
      const availableSeats = totalSeats - bookedSeats;

      return {
        id: trip.id,
        busName: trip.bus.name,
        operatorId: trip.bus.operatorId,
        from,
        to,
        date,
        price: trip.price,
        startTime: trip.startTime,
        endTime: trip.endTime,
        totalSeats,
        bookedSeats,
        availableSeats,
      };
    });

    // 4️⃣ Save search log
    await prisma.searchLog.create({
      data: { from, to, date }
    });

    return res.json({ success: true, trips: result });

  } catch (err) {
    console.error("searchTrips error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
