import prisma from "../utils/prisma.js";

const LOCK_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export async function releaseExpiredSeatLocks() {
  const cutoff = new Date(Date.now() - LOCK_EXPIRY_MS);

  try {
    const result = await prisma.tripSeat.updateMany({
      where: {
        booked: false,                 // never touch confirmed seats
        lockedAt: { lt: cutoff },      // lock expired
        lockedByUserId: { not: null }  // only locked seats
      },
      data: {
        lockedAt: null,
        lockedByUserId: null
      }
    });

    if (result.count > 0) {
      console.log(`🔓 Released ${result.count} expired seat locks`);
    }
  } catch (err) {
    console.error("⚠️ seat unlock job failed:", err.message);
  }
}
