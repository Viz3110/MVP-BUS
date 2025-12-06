import prisma from "../utils/prisma.js";

// GET ALL BUSES
export const getAllBuses = async (req, res) => {
  try {
    const buses = await prisma.bus.findMany({
      include: { operator: true },
    });

    return res.json({ success: true, buses });
  } catch (err) {
    console.error("getAllBuses error:", err);
    return res.status(500).json({ success: false });
  }
};

// GET BUS
export const getBus = async (req, res) => {
  try {
    const bus = await prisma.bus.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!bus)
      return res.status(404).json({ success: false, message: "Bus not found" });

    return res.json({ success: true, bus });
  } catch (err) {
    console.error("getBus error:", err);
    return res.status(500).json({ success: false });
  }
};

// CREATE BUS
export const createBus = async (req, res) => {
  try {
    const { operatorId, name, seats, seatLayout } = req.body;

    if (!operatorId || !name || !seats || !seatLayout) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const bus = await prisma.bus.create({
      data: { operatorId, name, seats, seatLayout }
    });

    res.json({ success: true, bus });

  } catch (err) {
    console.error("createBus error:", err);
    res.status(500).json({ success: false });
  }
};

// UPDATE BUS
export const updateBus = async (req, res) => {
  try {
    const bus = await prisma.bus.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    return res.json({ success: true, bus });
  } catch (err) {
    console.error("updateBus error:", err);
    return res.status(500).json({ success: false });
  }
};

// DELETE BUS
export const deleteBus = async (req, res) => {
  try {
    await prisma.bus.delete({
      where: { id: Number(req.params.id) },
    });

    return res.json({ success: true, message: "Bus deleted" });
  } catch (err) {
    console.error("deleteBus error:", err);
    return res.status(500).json({ success: false });
  }
};
