import "server-only";

import type { Pool, PoolConfig } from "pg";

import { env } from "@/lib/server/env";

let pool: Pool | null = null;

function getPoolConfig(): PoolConfig {
  if (env.DATABASE_URL) {
    return {
      connectionString: env.DATABASE_URL,
      ssl:
        env.DB_SSLMODE === "require"
          ? { rejectUnauthorized: true }
          : undefined,
    };
  }

  if (!env.DB_HOST || !env.DB_NAME || !env.DB_USER) {
    throw new Error(
      "Database is enabled but DB_HOST, DB_NAME, and DB_USER are not configured.",
    );
  }

  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl:
      env.DB_SSLMODE === "require"
        ? { rejectUnauthorized: true }
        : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  };
}

export async function getDbPool() {
  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool(getPoolConfig());
  }

  return pool;
}
