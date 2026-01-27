import prisma from "../utils/prisma.js";

// SEARCH BUSES
export const searchBuses = async (req, res) => {
  try {
    const { from, to, date, userId } = req.body;

    if (!from || !to || !date)
      return res.status(400).json({ success: false, message: "Missing fields" });

    // Log search
    await prisma.searchLog.create({
      data: { from, to, date, userId: userId || null }
    });

    // Fetch buses
    const buses = await prisma.bus.findMany({
      where: { from, to }
    });

    return res.json({ success: true, buses });

  } catch (err) {
    console.error("searchBuses error:", err);
    return res.status(500).json({ success: false });
  }
};
export const getBusSeats = async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await prisma.bus.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        totalSeats: true,
        seatLayout: true, // optional
      },
    });

    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found" });
    }

    return res.status(200).json({
      success: true,
      busId: bus.id,
      totalSeats: bus.totalSeats,
      seats: bus.seatLayout || [],
    });
  } catch (err) {
    console.error("getBusSeats error:", err);
    return res.status(500).json({ success: false });
  }
};
