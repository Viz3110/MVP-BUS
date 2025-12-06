import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Auto-generate seats
function generateSeats(count) {
  const seats = [];
  for (let i = 1; i <= count; i++) {
    seats.push({ seatNo: `S${i}`, available: true });
  }
  return seats;
}

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
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


  // Create Admin
  const hashed = await bcrypt.hash("admin123", 10);

  await prisma.admin.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: hashed
    }
  });

  console.log("✅ Admin created: admin / admin123");

  // Create Operator
  const operator = await prisma.operator.create({
    data: {
      name: "Green Travels"
    }
  });

  console.log("✅ Operator created:", operator.name);

  // Seed Buses
  await prisma.bus.createMany({
    data: [
      {
        operatorId: operator.id,
        name: "Green Express",
        seats: 40,
        seatLayout: generateSeats(40)
      },
      {
        operatorId: operator.id,
        name: "Metro Deluxe",
        seats: 30,
        seatLayout: generateSeats(30)
      }
    ]
  });

  console.log("✅ Bus data inserted!");
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
