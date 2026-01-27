// controllers/seat.controller.js
import prisma from "../utils/prisma.js";

export const lockSeat = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { seatNo, userId } = req.body;

    if (!seatNo || !userId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const seat = await prisma.tripSeat.findFirst({
      where: { tripId: Number(tripId), seatNo }
    });

    if (!seat) {
      return res.status(404).json({ success: false, message: "Seat not found" });
    }

    // ❌ already booked
    if (seat.booked) {
      return res.status(409).json({ success: false, message: "Seat already booked" });
    }

    // ❌ locked by someone else
    if (seat.lockedByUserId && seat.lockedByUserId !== userId) {
      return res.status(409).json({ success: false, message: "Seat locked" });
    }

    await prisma.tripSeat.update({
      where: { id: seat.id },
      data: {
        lockedByUserId: userId,
        lockedAt: new Date()
      }
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("lockSeat error:", err);
    res.status(500).json({ success: false });
  }
};
