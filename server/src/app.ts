import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xssClean from "xss-clean";
import { healthController } from "./controllers/healthController";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import adminRouter from "./routes/adminRoutes";
import authRouter from "./routes/authRoutes";
import escalationRouter from "./routes/escalationRoutes";
import reportRouter from "./routes/reportRoutes";
import userRouter from "./routes/userRoutes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(xssClean());

  app.use(
    "/api",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 120,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  app.get("/api/health", healthController);
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/reports", reportRouter);
  app.use("/api/escalations", escalationRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
