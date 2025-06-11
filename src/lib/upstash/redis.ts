import { Redis } from '@upstash/redis'

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Helper functions for common operations
export class RedisService {
  /**
   * Set a key-value pair with optional expiration
   */
  static async set(key: string, value: any, expireInSeconds?: number): Promise<boolean> {
    try {
      if (expireInSeconds) {
        await redis.setex(key, expireInSeconds, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }
      return true
    } catch (error) {
      console.error('Redis SET error:', error)
      return false
    }
  }

  /**
   * Get a value by key
   */
  static async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key)
      if (value === null) return null
      return typeof value === 'string' ? JSON.parse(value) : value
    } catch (error) {
      console.error('Redis GET error:', error)
      return null
    }
  }

  /**
   * Delete a key
   */
  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('Redis DEL error:', error)
      return false
    }
  }

  /**
   * Check if a key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis EXISTS error:', error)
      return false
    }
  }

  /**
   * Set expiration on an existing key
   */
  static async expire(key: string, seconds: number): Promise<boolean> {
    try {
      await redis.expire(key, seconds)
      return true
    } catch (error) {
      console.error('Redis EXPIRE error:', error)
      return false
    }
  }

  /**
   * Increment a numeric value
   */
  static async incr(key: string, by: number = 1): Promise<number | null> {
    try {
      if (by === 1) {
        return await redis.incr(key)
      } else {
        return await redis.incrby(key, by)
      }
    } catch (error) {
      console.error('Redis INCR error:', error)
      return null
    }
  }

  /**
   * Decrement a numeric value
   */
  static async decr(key: string, by: number = 1): Promise<number | null> {
    try {
      if (by === 1) {
        return await redis.decr(key)
      } else {
        return await redis.decrby(key, by)
      }
    } catch (error) {
      console.error('Redis DECR error:', error)
      return null
    }
  }

  /**
   * Get time-to-live for a key
   */
  static async ttl(key: string): Promise<number | null> {
    try {
      return await redis.ttl(key)
    } catch (error) {
      console.error('Redis TTL error:', error)
      return null
    }
  }

  /**
   * Get multiple keys at once
   */
  static async mget<T = any>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await redis.mget(...keys)
      return values.map(value => 
        value === null ? null : 
        typeof value === 'string' ? JSON.parse(value) : value
      )
    } catch (error) {
      console.error('Redis MGET error:', error)
      return keys.map(() => null)
    }
  }

  /**
   * Cache a function result
   */
  static async cache<T>(
    key: string,
    fetcher: () => Promise<T>,
    expireInSeconds: number = 3600
  ): Promise<T | null> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key)
      if (cached !== null) {
        return cached
      }

      // Fetch fresh data
      const data = await fetcher()
      
      // Cache the result
      await this.set(key, data, expireInSeconds)
      
      return data
    } catch (error) {
      console.error('Redis CACHE error:', error)
      return null
    }
  }
}

// Common cache keys
export const CACHE_KEYS = {
  PORTFOLIO_PROJECTS: 'portfolio:projects',
  USER_SESSION: (userId: string) => `user:session:${userId}`,
  API_RATE_LIMIT: (ip: string) => `rate_limit:${ip}`,
  PORTFOLIO_STATS: 'portfolio:stats',
  SEARCH_RESULTS: (query: string) => `search:${encodeURIComponent(query)}`,
} as const

// Cache durations in seconds
export const CACHE_DURATION = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  DAILY: 86400, // 24 hours
} as const 