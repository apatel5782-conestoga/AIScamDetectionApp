import { env } from "./config/env";
import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import bcrypt from "bcryptjs";
import UserModel from "./models/User";

async function seedAdminAccount() {
  if (!env.adminEmail || !env.adminPassword) return;

  const existing = await UserModel.findOne({ email: env.adminEmail });

  if (existing) {
    // Update password and ensure role is admin
    existing.passwordHash = await bcrypt.hash(env.adminPassword, 12);
    existing.role = "admin";
    await existing.save();
    console.log(`Admin account updated: ${env.adminEmail}`);
  } else {
    await UserModel.create({
      name: "Admin",
      username: "admin",
      email: env.adminEmail,
      phone: "0000000000",
      passwordHash: await bcrypt.hash(env.adminPassword, 12),
      role: "admin",
    });
    console.log(`Admin account created: ${env.adminEmail}`);
  }
}

async function bootstrap() {
  await connectDatabase();
  await seedAdminAccount();
  const app = createApp();
  app.listen(env.port, () => console.log(`AI Fraud Intelligence API running on port ${env.port}`));
}

bootstrap().catch((error: Error) => {
  console.error("Failed to start server", error.message);
  process.exit(1);
});
