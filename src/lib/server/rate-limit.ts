import "server-only";

import { env } from "@/lib/server/env";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS,
    });

    return {
      allowed: true,
      limit: env.RATE_LIMIT_MAX,
      remaining: env.RATE_LIMIT_MAX - 1,
      retryAfterSeconds: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
    };
  }

  current.count += 1;
  const allowed = current.count <= env.RATE_LIMIT_MAX;

  return {
    allowed,
    limit: env.RATE_LIMIT_MAX,
    remaining: Math.max(0, env.RATE_LIMIT_MAX - current.count),
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
