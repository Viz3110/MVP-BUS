export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { id: "desc" },
      include: {
        user: true,
        bus: true
      }
    });

    return res.json({ success: true, bookings });

  } catch (err) {
    console.error("getAllBookings error:", err);
    return res.status(500).json({ success: false });
  }
};
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalBookings = await prisma.booking.count();
    const totalRevenue = await prisma.booking.aggregate({
      _sum: { price: true }
    });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenue._sum.price || 0
      }
    });

  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ success: false });
  }
};
