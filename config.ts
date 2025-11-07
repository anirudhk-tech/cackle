import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_API_KEY: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Environment variables validation failed");
}

export const env = _env.data;
