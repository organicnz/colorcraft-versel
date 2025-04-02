import { headers } from 'next/headers';
import { apiLogger } from './logger';

/**
 * In-memory store for rate limiting data
 * Note: This will be cleared on server restart
 * For production, consider using Redis or another shared cache
 */
type RateLimitStore = {
  [key: string]: {
    count: number;
    resetAt: number;
  };
};

// Store rate limit data in memory
const rateLimitStore: RateLimitStore = {};

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

const DEFAULT_LIMIT = 60; // 60 requests per window
const DEFAULT_WINDOW = 60; // 1 minute window

/**
 * Clean expired entries from the store
 * Should be called periodically to prevent memory leaks
 */
function cleanRateLimitStore(): void {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetAt < now) {
      delete rateLimitStore[key];
    }
  });
}

// Clean store every 5 minutes
setInterval(cleanRateLimitStore, 5 * 60 * 1000);

/**
 * Get a key for rate limiting based on IP and optional identifier
 */
function getRateLimitKey(identifier?: string): string {
  const headersList = headers();
  // Get IP address or fallback to a placeholder
  const ip = headersList.get('x-forwarded-for') || 
    headersList.get('x-real-ip') || 
    'unknown-ip';
  
  return `ratelimit:${ip}:${identifier || 'default'}`;
}

/**
 * Check if a rate limit has been exceeded
 */
export async function checkRateLimit(
  options: RateLimitOptions = {}
): Promise<{ 
  success: boolean; 
  limit: number; 
  remaining: number; 
  reset: number;
}> {
  const key = getRateLimitKey(options.identifier);
  const limit = options.limit || DEFAULT_LIMIT;
  const windowInSeconds = options.windowInSeconds || DEFAULT_WINDOW;
  
  const now = Date.now();
  const resetAt = now + (windowInSeconds * 1000);
  
  // Initialize or get the current rate limit entry
  if (!rateLimitStore[key] || rateLimitStore[key].resetAt < now) {
    rateLimitStore[key] = {
      count: 0,
      resetAt,
    };
  }
  
  // Increment the counter
  rateLimitStore[key].count += 1;
  
  const count = rateLimitStore[key].count;
  const resetTimeSeconds = Math.ceil((rateLimitStore[key].resetAt - now) / 1000);
  
  // Determine if rate limit is exceeded
  const success = count <= limit;
  
  if (!success) {
    apiLogger.warn(`Rate limit exceeded for ${key}`, {
      metadata: { limit, count, resetTimeSeconds }
    });
  }
  
  return {
    success,
    limit,
    remaining: Math.max(0, limit - count),
    reset: resetTimeSeconds,
  };
}

/**
 * Higher-order function to apply rate limiting to server actions
 * @param actionFn - The server action function to wrap with rate limiting
 * @param options - Rate limit options
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
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
        code: 'RATE_LIMITED',
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
