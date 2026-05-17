/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window counter per identifier (user ID or IP).
 *
 * For production, swap with Redis-backed implementation.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limits = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limits) {
    if (now > entry.resetAt) {
      limits.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Max requests per window */
  maxRequests: number;
}

export const RATE_LIMITS = {
  /** Chat API: 20 requests per minute per user */
  chat: { windowMs: 60_000, maxRequests: 20 } satisfies RateLimitConfig,
  /** Auth endpoints: 5 requests per minute per IP */
  auth: { windowMs: 60_000, maxRequests: 5 } satisfies RateLimitConfig,
  /** General API: 60 requests per minute */
  api: { windowMs: 60_000, maxRequests: 60 } satisfies RateLimitConfig,
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = limits.get(identifier);

  // No entry or expired window — start fresh
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    limits.set(identifier, { count: 1, resetAt });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Within window — check count
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client identifier from request.
 * Uses user ID if authenticated, otherwise falls back to IP.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}
