import { headers } from "next/headers";
import { apiLogger } from "./logger";

/**
 * In-memory store for rate limiting data
 * Note: This will be cleared on server restart
 * For production, consider using Redis or another shared cache
 */
type RateLimitStore = Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>;

// Use Map for better performance with large number of entries
const rateLimitStore: RateLimitStore = new Map();

/**
 * Options for rate limiting
 */
export interface RateLimitOptions {
  /** Number of allowed requests per window */
  limit?: number;
  /** Window size in seconds */
  windowInSeconds?: number;
  /** Optional additional identifier */
  identifier?: string;
}

// Constants - better performance without recalculating them
const DEFAULT_LIMIT = 60; // 60 requests per window
const DEFAULT_WINDOW = 60; // 1 minute window
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Clean expired entries from the store
 * Using Map.forEach is more efficient than Object.keys
 */
function cleanRateLimitStore(): void {
  const now = Date.now();
  // More performant with Map.forEach than Object.keys iterations
  rateLimitStore.forEach((value, key) => {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  });
}

// Clean store every 5 minutes
setInterval(cleanRateLimitStore, CLEANUP_INTERVAL);

/**
 * Get a key for rate limiting based on IP and optional identifier
 */
async function getRateLimitKey(identifier?: string): Promise<string> {
  try {
    const headersList = await headers();
    // Get IP address or fallback to a placeholder
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown-ip";

    return `ratelimit:${ip}:${identifier || "default"}`;
  } catch (error) {
    // Fallback for environments where headers() is not available
    return `ratelimit:unknown:${identifier || "default"}`;
  }
}

/**
 * Check if a rate limit has been exceeded
 */
export async function checkRateLimit(options: RateLimitOptions = {}): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const key = await getRateLimitKey(options.identifier);
  const limit = options.limit || DEFAULT_LIMIT;
  const windowInSeconds = options.windowInSeconds || DEFAULT_WINDOW;

  const now = Date.now();

  // Get or initialize rate limit entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowInSeconds * 1000,
    };
  }

  // Increment the counter
  entry.count += 1;

  // Store updated entry
  rateLimitStore.set(key, entry);

  const resetTimeSeconds = Math.ceil((entry.resetAt - now) / 1000);
  const remaining = Math.max(0, limit - entry.count);
  const success = entry.count <= limit;

  if (!success) {
    apiLogger.warn(`Rate limit exceeded for ${key}`, {
      metadata: { limit, count: entry.count, resetTimeSeconds },
    });
  }

  return {
    success,
    limit,
    remaining,
    reset: resetTimeSeconds,
  };
}

/**
 * Higher-order function to apply rate limiting to server actions
 * @param actionFn - The server action function to wrap with rate limiting
 * @param options - Rate limit options
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<any>>(
  actionFn: T,
  options: RateLimitOptions = {}
): T {
  const wrappedAction = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const result = await checkRateLimit(options);

    if (!result.success) {
      // Rate limit exceeded
      const error = {
        success: false,
        error: `Rate limit exceeded. Try again in ${result.reset} seconds.`,
        code: "RATE_LIMITED",
      };

      // TypeScript needs this cast because it doesn't know the return type
      return error as unknown as ReturnType<T>;
    }

    // Rate limit not exceeded, call the original function
    return await actionFn(...args);
  };

  // TypeScript needs this cast because it doesn't understand that
  // the wrappedAction has the same type as the original function
  return wrappedAction as T;
}

// For testing purposes
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}
