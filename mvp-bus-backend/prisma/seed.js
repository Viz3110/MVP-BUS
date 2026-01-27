import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* ================= AUTO-GENERATE SEATS ================= */
function generateSeats(count) {
  const seats = [];
  for (let i = 1; i <= count; i++) {
    seats.push({
      seatNo: `S${i}`,
      available: true,
    });
  }
  return seats;
}

async function main() {
  console.log("🌱 Seeding database...");

  /* ================= CLEAR DATA ================= */
  await prisma.tripSeat.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();

  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.bus.deleteMany();

  await prisma.operator.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  /* ================= ADMIN ================= */
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.admin.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: hashed,
    },
  });

  console.log("✅ Admin created: admin / admin123");

  /* ================= OPERATOR ================= */
  const operator = await prisma.operator.create({
    data: {
      name: "Green Travels",
    },
  });

  console.log("✅ Operator created:", operator.name);

  /* ================= BUS ================= */
const bus = await prisma.bus.create({
  data: {
    operatorId: operator.id,
    name: "Green Express",
    seats: 40,
    seatLayout: generateSeats(40),

    from: "Chennai",
    to: "Bangalore",
    departure: "23:00",
    arrival: "05:50",
    price: 1200, // ✅ ADD THIS
  },
});

  console.log("✅ Bus created:", bus.name);

  /* ================= ROUTE ================= */
  const route = await prisma.route.create({
    data: {
      from: "Chennai",
      to: "Bangalore",
    },
  });

  console.log("✅ Route created: Chennai → Bangalore");

  /* ================= TRIP ================= */
  const trip = await prisma.trip.create({
  data: {
    routeId: route.id,
    busId: bus.id,
    date: new Date("2026-01-12"),
    startTime: "23:00",  
    endTime: "05:50", 
    price: 1200,
  },
});

  console.log("✅ Trip created:", trip.id);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
