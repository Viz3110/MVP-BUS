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
