import { createApp } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";

async function bootstrap() {
  await connectDatabase();
  const app = createApp();
  app.listen(env.port, () => console.log(`AI Fraud Intelligence API running on port ${env.port}`));
}

bootstrap().catch((error: Error) => {
  console.error("Failed to start server", error.message);
  process.exit(1);
});
