import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const connectDB = async () => {
  // Skip real connection if MONGODB_URI is a placeholder or if dev wants to skip
  if (env.MONGODB_URI.startsWith("SKIP") || env.MONGODB_URI === "") {
    logger.warn(
      "MongoDB connection skipped (MONGODB_URI=SKIP). Running without database."
    );
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected.");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
  } catch (err) {
    if (env.NODE_ENV === "development") {
      logger.warn(
        `⚠️  MongoDB not reachable (${err.message}).\n` +
          `   Server will start WITHOUT a database connection.\n` +
          `   To fix: start MongoDB locally (mongod), use Docker, or set MONGODB_URI to a MongoDB Atlas URI in server/.env.\n` +
          `   To skip permanently in dev, set MONGODB_URI=SKIP in server/.env`
      );
    } else {
      logger.error(`MongoDB connection failed: ${err.message}`);
      process.exit(1);
    }
  }
};
