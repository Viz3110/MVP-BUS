import prisma from "../utils/prisma.js";

const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * CREATE BOOKING (AFTER SEAT LOCK)
 */
export const createBooking = async (req, res) => {
  try {
    const { userId, tripId, seats, passengers = [] } = req.body;

    if (!userId || !tripId || !seats?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: Number(tripId) }
    });

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const tripSeats = await prisma.tripSeat.findMany({
      where: {
        tripId: Number(tripId),
        seatNo: { in: seats }
      }
    });

    if (tripSeats.length !== seats.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid seat selection"
      });
    }

    const now = new Date();

    for (const seat of tripSeats) {
      if (seat.booked) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.seatNo} is already booked`
        });
      }

      if (seat.lockedByUserId !== Number(userId)) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.seatNo} is not locked by you`
        });
      }

      if (!seat.lockedAt || now - seat.lockedAt > LOCK_DURATION) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seat.seatNo} lock expired`
        });
      }
    }

    const totalPrice = trip.price * seats.length;

    const booking = await prisma.$transaction(async (tx) => {
      const conflict = await tx.tripSeat.findMany({
        where: {
          tripId: Number(tripId),
          seatNo: { in: seats },
          booked: true
        }
      });

      if (conflict.length) {
        throw new Error(`Seat ${conflict[0].seatNo} was just booked`);
      }

      const newBooking = await tx.booking.create({
        data: {
          userId: Number(userId),
          busId: trip.busId,
          tripId: Number(tripId),
          seats,
          price: totalPrice,
          paymentStatus: "PENDING",
          paymentMethod: "COD",
          passengers: passengers.length ? { create: passengers } : undefined
        },
        include: { passengers: true }
      });

      await tx.tripSeat.updateMany({
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

      return newBooking;
    });

    return res.json({
      success: true,
      message: "Booking successful",
      booking
    });

  } catch (err) {
    console.error("createBooking error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


/**
 * SEARCH TRIPS (MVP placeholder)
 */
export const searchTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: { bus: true }
    });

    return res.json({ success: true, trips });

  } catch (err) {
    console.error("searchTrips error:", err);
    return res.status(500).json({ success: false });
  }
};


/**
 * GET TRIP SEATS WITH LOCK STATUS
 */
export const getTripSeats = async (req, res) => {
  try {
    const { tripId } = req.params;

    const seats = await prisma.tripSeat.findMany({
      where: { tripId: Number(tripId) }
    });

    const now = Date.now();

    const mapped = seats.map(s => {
      const expired =
        s.lockedAt && now - s.lockedAt.getTime() > LOCK_DURATION;

      return {
        seatNo: s.seatNo,
        booked: s.booked,
        status: s.booked
          ? "booked"
          : expired
          ? "available"
          : s.lockedByUserId
          ? "locked"
          : "available"
      };
    });

    return res.json({ success: true, seats: mapped });

  } catch (err) {
    console.error("getTripSeats error:", err);
    return res.status(500).json({ success: false });
  }
};


/**
 * LOCK SEAT
 */
export const lockSeat = async (req, res) => {
  try {
    const { tripId, seatNo, userId } = req.body;

    if (!tripId || !seatNo || !userId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const seat = await prisma.tripSeat.findFirst({
      where: { tripId: Number(tripId), seatNo }
    });

    if (!seat) {
      return res.status(404).json({ success: false, message: "Seat not found" });
    }

    if (seat.booked) {
      return res.status(400).json({ success: false, message: "Seat already booked" });
    }

    const now = Date.now();
    const expired =
      seat.lockedAt && now - seat.lockedAt.getTime() > LOCK_DURATION;

    if (seat.lockedByUserId && seat.lockedByUserId !== Number(userId) && !expired) {
      return res.status(400).json({
        success: false,
        message: "Seat locked by another user"
      });
    }

    await prisma.tripSeat.update({
      where: { id: seat.id },
      data: {
        lockedByUserId: Number(userId),
        lockedAt: new Date()
      }
    });

    return res.json({ success: true, message: "Seat locked" });

  } catch (err) {
    console.error("lockSeat error:", err);
    return res.status(500).json({ success: false });
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


export const getMyBookings = async (req, res) => {
  try {
    const { id } = req.user; // from auth middleware

    const bookings = await prisma.booking.findMany({
      where: { userId: Number(id) },
      orderBy: { id: "desc" }
    });

    return res.json({ success: true, bookings });

  } catch (err) {
    console.error("getMyBookings error:", err);
    return res.status(500).json({ success: false });
  }
};
/**
 * GET SINGLE BOOKING
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

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) }
    });

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    await prisma.tripSeat.updateMany({
      where: {
        tripId: booking.tripId,
        seatNo: { in: booking.seats }
      },
      data: { booked: false }
    });

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

    const updated = await prisma.booking.update({
      where: { id: Number(id) },
      data: {
        paymentStatus: "PAID",
        paymentMethod: "COD"
      }
    });

    return res.json({
      success: true,
      message: "Payment updated",
      booking: updated
    });

  } catch (err) {
    console.error("markBookingPaid error:", err);
    return res.status(500).json({ success: false });
  }
};


/**
 * CONFIRM BOOKING (PAYMENT SUCCESS)
 */
export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.body;

    const booking = await prisma.booking.update({
      where: { id: Number(id) },
      data: { paymentStatus: "PAID" }
    });

    return res.json({
      success: true,
      message: "Booking confirmed",
      booking
    });

  } catch (err) {
    console.error("confirmBooking error:", err);
    return res.status(500).json({ success: false });
  }
};
