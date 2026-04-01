import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5050),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aifrauddb",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
};

if (!env.jwtSecret) {
  console.warn("Missing required env vars. Set JWT_SECRET in server/.env");
}
if (!env.adminEmail || !env.adminPassword) {
  console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in server/.env - admin account will not be created.");
}
if (!env.openAiApiKey) {
  console.warn("OPENAI_API_KEY not set in server/.env - AI chat will use fallback guidance until the key is added.");
}
