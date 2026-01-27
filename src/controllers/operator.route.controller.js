import prisma from "../utils/prisma.js";

// Create route
export const createRoute = async (req, res) => {
  try {
    const { from, to } = req.body;
    const operatorId = req.operator.id;

    const route = await prisma.route.create({
      data: { from, to }
    });

    return res.json({ success: true, route });

  } catch (err) {
    console.error("createRoute error:", err);
    return res.status(500).json({ success: false });
  }
};

// Add stop to route
export const addRouteStop = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { name, order } = req.body;

    const stop = await prisma.routeStop.create({
      data: { routeId: Number(routeId), name, order }
    });

    return res.json({ success: true, stop });

  } catch (err) {
    console.error("addRouteStop error:", err);
    return res.status(500).json({ success: false });
  }
};

// List routes with stops
export const getRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      include: { stops: true }
    });

    return res.json({ success: true, routes });

  } catch (err) {
    console.error("getRoutes error:", err);
    return res.status(500).json({ success: false });
  }
};
