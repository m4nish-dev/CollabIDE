import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import apiRouter from "./routes/index.js";
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { requestId } from "./middleware/requestId.middleware.js";

const app = express();

// Attach request-id early
app.use(requestId);

// ─── Security ───────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global rate limiter: 300 req per 15 min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
  })
);

// ─── Parsing ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── Data sanitization ───────────────────────────────────────────────────────
// Inline NoSQL injection sanitizer (express-mongo-sanitize not compatible with Express 5)
// Strips any key that starts with $ or contains a dot from req.body and req.params
const sanitizeObj = (obj) => {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      sanitizeObj(obj[key]);
    }
  }
};
app.use((req, _res, next) => {
  if (req.body) sanitizeObj(req.body);
  if (req.params) sanitizeObj(req.params);
  next();
});
app.use(hpp()); // prevent HTTP parameter pollution

// ─── Compression & logging ───────────────────────────────────────────────────
app.use(compression());

if (env.NODE_ENV !== "test") {
  const morganFormat = env.NODE_ENV === "production" ? "combined" : "dev";
  app.use(
    morgan(morganFormat, {
      stream: { write: (msg) => logger.http(msg.trimEnd()) },
    })
  );
}

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/v1", apiRouter);

// ─── 404 & Error handlers ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export { app };
