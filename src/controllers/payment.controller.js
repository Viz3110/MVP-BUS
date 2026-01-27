import prisma from "../utils/prisma.js";

// Step 1: Initiate payment (returns fake paymentId)
export const initiatePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    // Fake payment ID
    const paymentId = "PAY_" + Math.floor(Math.random() * 10000000);

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentId }
    });

    return res.json({
      success: true,
      message: "Payment initiated",
      paymentId
    });

  } catch (err) {
    console.log("initiatePayment error:", err);
    return res.status(500).json({ success: false });
  }
};


// Step 2: Confirm payment
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    if (!paymentId) {
      return res.status(400).json({ success: false, message: "paymentId missing" });
    }

    const booking = await prisma.booking.findFirst({
      where: { paymentId }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Invalid paymentId" });
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: status === "SUCCESS" ? "SUCCESS" : "FAILED"
      }
    });

    return res.json({
      success: true,
      message: "Payment updated",
      bookingId: booking.id,
      finalStatus: status
    });

  } catch (err) {
    console.log("confirmPayment error:", err);
    return res.status(500).json({ success: false });
  }
};
