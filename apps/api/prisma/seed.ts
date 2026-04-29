import { prisma } from "../src/common/prisma/client.js";
import argon2 from "argon2";

async function seed() {
  // Create a new user
  try {
    // Hash user password
    const passwordHash = await argon2.hash("admin")

    const user = await prisma.user.create({
      data: {
        firstName: "admin",
        lastName: "admin",
        email: "admin@admin.com",
        passwordHash,
        role: "SUPERADMIN",
        status: "ACTIVE"
      },
    });
    console.log("Created user:", user);

    // Fetch all users with their posts
    const allUsers = await prisma.user.findMany();
    console.log("All users:", JSON.stringify(allUsers, null, 2));

  } catch (error) {
    console.error(error);
  }

  // Create default clubs
  try {
    const defaultClubs = [
      { name: "Literature Club", description: "Default description for Literature Club" },
      { name: "Foreign Language Club", description: "Default description for Foreign Language Club" },
      { name: "Art Club", description: "Default description for Art Club" },
      { name: "Music Club", description: "Default description for Music Club" },
      { name: "Digital Games Club", description: "Default description for Digital Games Club" },
    ];

    const createdClubs = await prisma.club.createMany({
      data: defaultClubs as any,
    });

    console.log(createdClubs);

  } catch (error) {
    console.error(error);
  }
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