import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || "admin@shopora.com";
  const password = process.argv[3] || "Admin@12345";
  const name = process.argv[4] || "Store Administrator";

  console.log(`\n--- Shopora Admin Setup ---`);
  console.log(`Target Email: ${email}`);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        role: "ADMIN",
        password: hashedPassword,
        name: existingUser.name || name,
      },
    });
    console.log(`✅ Existing user successfully promoted to ADMIN:`);
    console.log(`   Email: ${updated.email}`);
    console.log(`   Role: ${updated.role}`);
  } else {
    const created = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`✅ New ADMIN account created successfully:`);
    console.log(`   Email: ${created.email}`);
    console.log(`   Role: ${created.role}`);
  }

  console.log(`\nYou can now log in at /login and access /admin with this account.\n`);
}

main()
  .catch((e) => {
    console.error("Error creating admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
