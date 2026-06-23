import "server-only";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SITE_URL: z.url().default("http://localhost:3000"),
  CONTACT_WEBHOOK_URL: z.url().optional(),
  CONTACT_WEBHOOK_TOKEN: z.string().min(16).optional(),
  CONTACT_ALLOWED_ORIGIN: z.url().optional(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  CONTACT_WEBHOOK_URL: process.env.CONTACT_WEBHOOK_URL || undefined,
  CONTACT_WEBHOOK_TOKEN: process.env.CONTACT_WEBHOOK_TOKEN || undefined,
  CONTACT_ALLOWED_ORIGIN: process.env.CONTACT_ALLOWED_ORIGIN || undefined,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
});
