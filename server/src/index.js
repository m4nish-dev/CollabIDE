// Load and validate env first — exits process if vars are missing
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";

const start = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(
      `🚀 CollabIDE API running in ${env.NODE_ENV} mode at http://localhost:${env.PORT}/api/v1`
    );
    logger.info(
      `🔎 Health check: http://localhost:${env.PORT}/api/v1/health`
    );
  });

  // 3. Graceful shutdown on SIGTERM / SIGINT
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // 4. Crash on unhandled rejections
  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled rejection:", err);
    server.close(() => process.exit(1));
  });
};

start();
