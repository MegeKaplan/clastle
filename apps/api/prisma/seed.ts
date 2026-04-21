import { prisma } from "../src/common/prisma/client.js";
import argon2 from "argon2";

async function seed() {
  // Hash user password
  const passwordHash = await argon2.hash("admin")

  // Create a new user
  const user = await prisma.user.create({
    data: {
      firstName: "admin",
      lastName: "admin",
      email: "admin@admin.com",
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });