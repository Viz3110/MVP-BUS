import prisma from "../utils/prisma.js";

/**
 * CREATE BOOKING (AFTER SEAT LOCK)
 */
export const createBooking = async (req, res) => {
  try {
    const { userId, tripId, seats, passengers } = req.body;

    if (!userId || !tripId || !seats?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch trip
    const trip = await prisma.trip.findUnique({
      where: { id: Number(tripId) }
    });

    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    // Fetch seat records
    const tripSeats = await prisma.tripSeat.findMany({
      where: {
        tripId: Number(tripId),
        seatNo: { in: seats }
      }
    });

    const now = new Date();

    // Validate locking rules
    for (const seat of tripSeats) {
      if (seat.booked) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.seatNo} is already booked`
        });
      }

      if (seat.lockedByUserId !== userId) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.seatNo} is not locked by you`
        });
      }

      if (now - seat.lockedAt > 5 * 60 * 1000) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.seatNo} lock expired`
        });
      }
    }

    // PRICE = trip.price × number of seats
    const totalPrice = trip.price * seats.length;

    // Create booking
const booking = await prisma.booking.create({
  data: {
    userId,
    busId: trip.busId,
    tripId,
    seats,
    price: totalPrice,
    paymentStatus: "PENDING",
    paymentMethod: "COD",

    passengers: {
      create: passengers
    }
  },
  include: { passengers: true }
});

    // Mark seats as permanently booked
    await prisma.tripSeat.updateMany({
      where: {
        tripId: Number(tripId),
        seatNo: { in: seats }
      },
      data: {
        booked: true,
        lockedAt: null,
        lockedByUserId: null
      }
    });

    return res.json({
      success: true,
      message: "Booking successful",
      booking
    });

  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * GET ALL BOOKINGS FOR USER
 */
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: { userId: Number(userId) },
      orderBy: { id: "desc" },
      include: { bus: true, passengers: true }
    });

    return res.json({ success: true, bookings });

  } catch (err) {
    console.error("getUserBookings error:", err);
    return res.status(500).json({ success: false });
  }
};


/**
 * GET SINGLE BOOKING DETAILS
 */
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
      include: { bus: true, passengers: true }
    });

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    return res.json({ success: true, booking });

  } catch (err) {
    console.error("getBookingDetails error:", err);
    return res.status(500).json({ success: false });
  }
};


/**
 * CANCEL BOOKING
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.booking.update({
  where: { id: booking.id },
  data: {
    status: "CANCELLED",
    paymentStatus: "REFUNDED"
  }
});

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // Release seats in TripSeat
    await prisma.tripSeat.updateMany({
      where: {
        tripId: booking.tripId,
        seatNo: { in: booking.seats }
      },
      data: {
        booked: false
      }
    });

    // Update booking
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "REFUNDED",
        status: "CANCELLED"
      }
    });

    return res.json({
      success: true,
      message: "Booking cancelled",
      booking: updated
    });

  } catch (err) {
    console.error("cancelBooking error:", err);
    return res.status(500).json({ success: false });
  }
};


/**
 * MARK BOOKING AS PAID
 */
export const markBookingPaid = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        paymentStatus: "PAID",
        paymentMethod: "COD"
      }
    });

    return res.json({
      success: true,
      message: "Payment updated",
      booking
    });

  } catch (err) {
    console.error("markBookingPaid error:", err);
    return res.status(500).json({ success: false });
  }
};
