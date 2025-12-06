import prisma from "../utils/prisma.js";

/**
 * LOCK SEATS (5 minutes)
 */
export const lockSeats = async (req, res) => {
  try {
    const { tripId, seats, userId } = req.body;

    if (!tripId || !Array.isArray(seats) || seats.length === 0 || !userId) {
      return res.status(400).json({
        success: false,
        message: "tripId, seats array, and userId are required"
      });
    }

    const numericTripId = Number(tripId);
    const numericUserId = Number(userId);
    const now = new Date();

    // ✅ Fetch requested seats
    const tripSeats = await prisma.tripSeat.findMany({
      where: {
        tripId: numericTripId,
        seatNo: { in: seats }
      }
    });

    // ✅ Validate seat count matches request
    if (tripSeats.length !== seats.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid seat numbers selected"
      });
    }

    // ✅ Block already booked seats
    const alreadyBooked = tripSeats.some(seat => seat.booked === true);
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "Some selected seats are already booked"
      });
    }

    // ✅ Block seats locked by another active user
    const lockedByOtherUser = tripSeats.some(seat =>
      seat.lockedByUserId &&
      seat.lockedByUserId !== numericUserId &&
      (now - seat.lockedAt) < 5 * 60 * 1000
    );

    if (lockedByOtherUser) {
      return res.status(400).json({
        success: false,
        message: "Some seats are locked by another user"
      });
    }

    // ✅ Lock selected seats
    await prisma.tripSeat.updateMany({
      where: {
        tripId: numericTripId,
        seatNo: { in: seats }
      },
      data: {
        lockedByUserId: numericUserId,
        lockedAt: now
      }
    });

    return res.json({
      success: true,
      message: "Seats locked successfully for 5 minutes"
    });

  } catch (err) {
    console.error("lockSeats error:", err);
    return res.status(500).json({
      success: false,
      message: "Seat lock failed"
    });
  }
};


/**
 * UNLOCK SEATS (User exits seat selection)
 */
export const unlockSeats = async (req, res) => {
  try {
    const { tripId, userId } = req.body;

    if (!tripId || !userId) {
      return res.status(400).json({
        success: false,
        message: "tripId and userId are required"
      });
    }

    const numericTripId = Number(tripId);
    const numericUserId = Number(userId);

    await prisma.tripSeat.updateMany({
      where: {
        tripId: numericTripId,
        lockedByUserId: numericUserId
      },
      data: {
        lockedByUserId: null,
        lockedAt: null
      }
    });

    return res.json({
      success: true,
      message: "Seats unlocked successfully"
    });

  } catch (err) {
    console.error("unlockSeats error:", err);
    return res.status(500).json({
      success: false,
      message: "Seat unlock failed"
    });
  }
};
