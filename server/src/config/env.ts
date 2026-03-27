import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5050),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aifrauddb",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};

if (!env.jwtSecret) {
  // eslint-disable-next-line no-console
  console.warn("Missing required env vars. Set JWT_SECRET in server/.env (copy from .env.example).");
}
