"use client"

import { useState, useEffect, useCallback } from 'react'
import { RedisService, CACHE_DURATION } from '@/lib/upstash/redis'

interface UseCacheOptions<T> {
  key: string
  fetcher: () => Promise<T>
  duration?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

interface UseCacheReturn<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  invalidate: () => Promise<void>
  refresh: () => Promise<void>
  isFromCache: boolean
}

/**
 * Hook for caching data in Redis with automatic fetching and invalidation
 * 
 * @example
 * ```tsx
 * const { data, isLoading, invalidate } = useRedisCache({
 *   key: 'portfolio:projects',
 *   fetcher: async () => {
 *     const response = await fetch('/api/portfolio')
 *     return response.json()
 *   },
 *   duration: CACHE_DURATION.MEDIUM
 * })
 * ```
 */
export function useRedisCache<T>({
  key,
  fetcher,
  duration = CACHE_DURATION.SHORT,
  enabled = true,
  onError
}: UseCacheOptions<T>): UseCacheReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const loadData = useCallback(async (forceRefresh = false) => {
    if (!enabled) return
    
    setIsLoading(true)
    setError(null)

    try {
      // Try cache first (unless forcing refresh)
      if (!forceRefresh) {
        const cachedData = await RedisService.get<T>(key)
        if (cachedData !== null) {
          setData(cachedData)
          setIsFromCache(true)
          setIsLoading(false)
          return
        }
      }

      // Cache miss or forced refresh - fetch fresh data
      setIsFromCache(false)
      const freshData = await fetcher()
      
      // Store in cache
      await RedisService.set(key, freshData, duration)
      
      setData(freshData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      if (onError) {
        onError(error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher, duration, enabled, onError])

  const invalidate = useCallback(async () => {
    await RedisService.del(key)
    setData(null)
    setIsFromCache(false)
  }, [key])

  const refresh = useCallback(async () => {
    await loadData(true)
  }, [loadData])

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    isLoading,
    error,
    invalidate,
    refresh,
    isFromCache
  }
}

/**
 * Hook for managing multiple cache keys with batch operations
 */
export function useMultiCache<T extends Record<string, any>>(
  cacheConfigs: Array<{
    key: keyof T
    cacheKey: string
    fetcher: () => Promise<T[keyof T]>
    duration?: number
  }>
) {
  const [data, setData] = useState<Partial<T>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, Error>>({})

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    const newData: Partial<T> = {}
    const newErrors: Record<string, Error> = {}

    await Promise.allSettled(
      cacheConfigs.map(async (config) => {
        try {
          // Try cache first
          let result = await RedisService.get(config.cacheKey)
          
          if (result === null) {
            // Cache miss - fetch fresh data
            result = await config.fetcher()
            await RedisService.set(
              config.cacheKey, 
              result, 
              config.duration || CACHE_DURATION.SHORT
            )
          }
          
          newData[config.key] = result
        } catch (error) {
          newErrors[config.cacheKey] = error instanceof Error ? error : new Error('Unknown error')
        }
      })
    )

    setData(newData)
    setErrors(newErrors)
    setIsLoading(false)
  }, [cacheConfigs])

  const invalidateAll = useCallback(async () => {
    await Promise.allSettled(
      cacheConfigs.map(config => RedisService.del(config.cacheKey))
    )
    setData({})
    setErrors({})
  }, [cacheConfigs])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  return {
    data,
    isLoading,
    errors,
    loadAll,
    invalidateAll
  }
}

/**
 * Hook for simple counter caching (useful for analytics, API limits, etc.)
 */
export function useRedisCounter(key: string, enabled = true) {
  const [count, setCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  const increment = useCallback(async (by = 1) => {
    if (!enabled) return count + by
    
    setIsLoading(true)
    try {
      const newCount = await RedisService.incr(key, by)
      const finalCount = newCount ?? count + by
      setCount(finalCount)
      return finalCount
    } catch (error) {
      console.error('Failed to increment counter:', error)
      return count
    } finally {
      setIsLoading(false)
    }
  }, [key, enabled, count])

  const decrement = useCallback(async (by = 1) => {
    if (!enabled) return Math.max(0, count - by)
    
    setIsLoading(true)
    try {
      const newCount = await RedisService.decr(key, by)
      const finalCount = Math.max(0, newCount ?? count - by)
      setCount(finalCount) // Prevent negative counts
      return finalCount
    } catch (error) {
      console.error('Failed to decrement counter:', error)
      return count
    } finally {
      setIsLoading(false)
    }
  }, [key, enabled, count])

  const reset = useCallback(async () => {
    if (!enabled) return 0
    
    setIsLoading(true)
    try {
      await RedisService.del(key)
      setCount(0)
      return 0
    } catch (error) {
      console.error('Failed to reset counter:', error)
      return count
    } finally {
      setIsLoading(false)
    }
  }, [key, enabled, count])

  const load = useCallback(async () => {
    if (!enabled) return
    
    setIsLoading(true)
    try {
      const currentCount = await RedisService.get<number>(key) || 0
      setCount(currentCount)
    } catch (error) {
      console.error('Failed to load counter:', error)
    } finally {
      setIsLoading(false)
    }
  }, [key, enabled])

  useEffect(() => {
    load()
  }, [load])

  return {
    count,
    isLoading,
    increment,
    decrement,
    reset,
    reload: load
  }
} 