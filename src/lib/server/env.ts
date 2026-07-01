import "server-only";

import { z } from "zod";

const envBoolean = (defaultValue: boolean) =>
  z
    .preprocess((value) => {
      if (typeof value === "boolean") {
        return value;
      }

      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (["true", "1", "yes", "on"].includes(normalized)) {
          return true;
        }
        if (["false", "0", "no", "off", ""].includes(normalized)) {
          return false;
        }
      }

      return value;
    }, z.boolean())
    .default(defaultValue);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SITE_URL: z.url().default("http://localhost:3000"),
  CONTACT_WEBHOOK_URL: z.url().optional(),
  CONTACT_WEBHOOK_TOKEN: z.string().min(16).optional(),
  CONTACT_ALLOWED_ORIGIN: z.url().optional(),
  CONTACT_EMAIL_ENABLED: envBoolean(false),
  SMTP_HOST: z.string().min(1).optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: envBoolean(false),
  SMTP_FORCE_IPV4: envBoolean(true),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASSWORD: z.string().min(1).optional(),
  SMTP_FROM: z.string().min(1).optional(),
  SALES_NOTIFICATION_EMAIL: z.string().min(3).optional(),
  CONTACT_DATABASE_ENABLED: envBoolean(false),
  DATABASE_URL: z.string().min(1).optional(),
  DB_HOST: z.string().min(1).optional(),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_NAME: z.string().min(1).optional(),
  DB_USER: z.string().min(1).optional(),
  DB_PASSWORD: z.string().optional(),
  DB_SSLMODE: z.enum(["disable", "require"]).default("disable"),
  SANITY_SYNC_SECRET: z.string().min(24).optional(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  SITE_URL: process.env.SITE_URL,
  CONTACT_WEBHOOK_URL: process.env.CONTACT_WEBHOOK_URL || undefined,
  CONTACT_WEBHOOK_TOKEN: process.env.CONTACT_WEBHOOK_TOKEN || undefined,
  CONTACT_ALLOWED_ORIGIN: process.env.CONTACT_ALLOWED_ORIGIN || undefined,
  CONTACT_EMAIL_ENABLED: process.env.CONTACT_EMAIL_ENABLED,
  SMTP_HOST: process.env.SMTP_HOST || undefined,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_FORCE_IPV4: process.env.SMTP_FORCE_IPV4,
  SMTP_USER: process.env.SMTP_USER || undefined,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || undefined,
  SMTP_FROM: process.env.SMTP_FROM || undefined,
  SALES_NOTIFICATION_EMAIL: process.env.SALES_NOTIFICATION_EMAIL || undefined,
  CONTACT_DATABASE_ENABLED: process.env.CONTACT_DATABASE_ENABLED,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  DB_HOST: process.env.DB_HOST || undefined,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME || undefined,
  DB_USER: process.env.DB_USER || undefined,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_SSLMODE: process.env.DB_SSLMODE,
  SANITY_SYNC_SECRET: process.env.SANITY_SYNC_SECRET || undefined,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
});
