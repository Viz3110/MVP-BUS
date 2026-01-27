import prisma from "../utils/prisma.js";

export const createTrip = async (req, res) => {
  try {
    const { busId, routeId, date, startTime, endTime, price } = req.body;

    const operatorId = req.operator.id;

    // Check bus belongs to operator
    const bus = await prisma.bus.findFirst({
      where: { id: busId, operatorId }
    });

    if (!bus)
      return res.status(403).json({ success: false, message: "Not your bus" });

    const trip = await prisma.trip.create({
      data: {
        busId,
        routeId,
        date: new Date(date),
        price,
        startTime,
        endTime
      }
    });

    // Generate seats based on bus.seats
    const seatData = [];
    for (let i = 1; i <= bus.seats; i++) {
      seatData.push({
        tripId: trip.id,
        seatNo: `S${i}`
      });
    }

    await prisma.tripSeat.createMany({ data: seatData });

    return res.json({
      success: true,
      trip,
      seatsCreated: seatData.length
    });

  } catch (err) {
    console.error("createTrip error:", err);
    return res.status(500).json({ success: false });
  }
};
