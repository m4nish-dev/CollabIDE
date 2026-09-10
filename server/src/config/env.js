import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().url(),
  MONGODB_URI: z
    .string()
    .min(1)
    .describe("MongoDB connection URI, or 'SKIP' to run without database in dev"),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default("15m"),
  JWT_REFRESH_EXPIRES: z.string().default("7d"),
  COOKIE_DOMAIN: z.string().default("localhost"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().default("CollabIDE <noreply@collabide.dev>"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.errors
    .map((e) => `  ✗ ${e.path.join(".")}: ${e.message}`)
    .join("\n");
  console.error(
    `\n❌  Environment validation failed. Check your .env file:\n${issues}\n`
  );
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
