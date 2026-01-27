import prisma from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.create({
    data: {
      email: "admin@gmail.com",
      password: hashedPassword,
      username: "Super Admin",
    },
  });

  console.log("✅ Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
