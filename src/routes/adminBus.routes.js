import express from "express";

const router = express.Router();

/*
  TEMP DATA (replace with DB later)
*/
let buses = [
  {
    id: 1,
    busNumber: "TN01AB1234",
    busName: "Geo Express",
    totalSeats: 40,
    type: "AC Sleeper",
    isActive: true,
  },
];

/*
|--------------------------------------------------------------------------
| ADMIN BUS ROUTES
|--------------------------------------------------------------------------
| These routes are for ADMIN use only
| Auth middleware can be added later
*/

/**
 * @route   GET /api/admin/buses
 * @desc    Get all buses (admin view)
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: buses.length,
    data: buses,
  });
});

/**
 * @route   POST /api/admin/buses
 * @desc    Add a new bus
 */
router.post("/", (req, res) => {
  const { busNumber, busName, totalSeats, type } = req.body;

  if (!busNumber || !busName || !totalSeats || !type) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const newBus = {
    id: buses.length + 1,
    busNumber,
    busName,
    totalSeats,
    type,
    isActive: true,
  };

  buses.push(newBus);

  res.status(201).json({
    success: true,
    message: "Bus added successfully",
    data: newBus,
  });
});

/**
 * @route   PUT /api/admin/buses/:id
 * @desc    Update bus details
 */
router.put("/:id", (req, res) => {
  const busId = parseInt(req.params.id);
  const bus = buses.find((b) => b.id === busId);

  if (!bus) {
    return res.status(404).json({
      success: false,
      message: "Bus not found",
    });
  }

  Object.assign(bus, req.body);

  res.status(200).json({
    success: true,
    message: "Bus updated successfully",
    data: bus,
  });
});

/**
 * @route   DELETE /api/admin/buses/:id
 * @desc    Delete a bus
 */
router.delete("/:id", (req, res) => {
  const busId = parseInt(req.params.id);
  const index = buses.findIndex((b) => b.id === busId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Bus not found",
    });
  }

  buses.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Bus deleted successfully",
  });
});

export default router;
