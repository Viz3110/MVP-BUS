import prisma from "../utils/prisma.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: "desc" },
      include: {
        user: true,
        bus: true,
        passengers: true,
      },
    });

    return res.json({ success: true, bookings });
  } catch (err) {
    console.error("getAllBookings error:", err);
    return res.status(500).json({ success: false });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        bus: true,
        passengers: true,
      },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.json({ success: true, booking });
  } catch (err) {
    console.error("getBookingDetails error:", err);
    return res.status(500).json({ success: false });
  }
};
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking)
      return res.status(404).json({ success: false, message: "Not found" });

    // Free seats in TripSeat
    await prisma.tripSeat.updateMany({
      where: {
        tripId: booking.busId, // ⚠️ if tripId is separate, update this
        seatNo: { in: booking.seats },
      },
      data: { booked: false },
    });

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "CANCELLED",
      },
    });

    return res.json({ success: true, booking: updated });
  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ success: false });
  }
};
