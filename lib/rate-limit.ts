import { env } from "@/lib/env.server";
import { createLogger } from "./logger";

const logger = createLogger("rate-limit");

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitStore>();

const WINDOW_MS = env.RATE_LIMIT_WINDOW ?? 60000;
const MAX_REQUESTS = env.RATE_LIMIT_MAX_REQUESTS ?? 10;

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetAt) {
      store.delete(key);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(identifier: string): RateLimitResult {
  cleanupExpiredEntries();

  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitStore = {
      count: 1,
      resetAt: now + WINDOW_MS,
    };
    store.set(identifier, newRecord);

    logger.debug(
      { identifier, remaining: MAX_REQUESTS - 1 },
      "Rate limit: novo registro",
    );

    return {
      success: true,
      limit: MAX_REQUESTS,
      remaining: MAX_REQUESTS - 1,
      reset: newRecord.resetAt,
    };
  }

  if (record.count >= MAX_REQUESTS) {
    logger.warn(
      { identifier, limit: MAX_REQUESTS, resetAt: record.resetAt },
      "Rate limit excedido",
    );

    return {
      success: false,
      limit: MAX_REQUESTS,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count++;

  logger.debug(
    { identifier, count: record.count, remaining: MAX_REQUESTS - record.count },
    "Rate limit: requisição contabilizada com sucesso",
  );

  return {
    success: true,
    limit: MAX_REQUESTS,
    remaining: MAX_REQUESTS - record.count,
    reset: record.resetAt,
  };
}
