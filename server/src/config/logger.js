import { createLogger, format, transports } from "winston";
import { env } from "./env.js";

const { combine, timestamp, printf, colorize, errors } = format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: env.NODE_ENV === "production" ? "warn" : "debug",
  format: env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new transports.Console()],
});

if (env.NODE_ENV === "production") {
  logger.add(
    new transports.File({ filename: "logs/error.log", level: "error" })
  );
  logger.add(new transports.File({ filename: "logs/combined.log" }));
}

export { logger };
