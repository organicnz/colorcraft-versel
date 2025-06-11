/**
 * Advanced Database Query Optimizer
 * Consolidates and optimizes Supabase queries with intelligent caching and batching
 */

import { createClient } from "./client";
import { createClient as createServerClient } from "./server";
import { logger, dbLogger } from "../logger";
import { retry } from "../utils";

// Query optimization configuration
const OPTIMIZATION_CONFIG = {
  batchDelay: 50, // ms
  maxBatchSize: 10,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000,
};

// Cache implementation with TTL
class QueryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = OPTIMIZATION_CONFIG.cacheTimeout): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  size(): number {
    return this.cache.size;
  }
}

const queryCache = new QueryCache();

// Batch query manager for combining similar queries
class BatchQueryManager {
  private batches = new Map<string, Array<{ resolve: Function; reject: Function; params: any }>>();

  async batchQuery<T>(
    batchKey: string,
    queryFn: (batchedParams: unknown[]) => Promise<T[]>,
    params: any
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(batchKey)) {
        this.batches.set(batchKey, []);

        // Process batch after delay
        setTimeout(() => {
          this.processBatch(batchKey, queryFn);
        }, OPTIMIZATION_CONFIG.batchDelay);
      }

      this.batches.get(batchKey)!.push({ resolve, reject, params });
    });
  }

  private async processBatch<T>(
    batchKey: string,
    queryFn: (batchedParams: unknown[]) => Promise<T[]>
  ) {
    const batch = this.batches.get(batchKey);
    if (!batch) return;

    this.batches.delete(batchKey);

    try {
      const batchedParams = batch.map((item) => item.params);
      const results = await queryFn(batchedParams);

      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach((item) => {
        item.reject(error);
      });
    }
  }
}

const batchManager = new BatchQueryManager();

// Main optimizer class
export class DatabaseQueryOptimizer {
  private supabase: ReturnType<typeof createClient> | ReturnType<typeof createServerClient>;

  constructor(isServer: boolean = false) {
    this.supabase = isServer ? createServerClient() : createClient();
  }

  /**
   * Optimized portfolio queries with intelligent caching
   */
  async getPortfolioItems(
    options: {
      limit?: number;
      featured?: boolean;
      status?: string;
      useCache?: boolean;
    } = {}
  ) {
    const { limit = 50, featured, status, useCache = true } = options;
    const cacheKey = `portfolio_${limit}_${featured}_${status}`;

    // Check cache first
    if (useCache) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        dbLogger.debug(`Cache hit for portfolio query: ${cacheKey}`);
        return cached;
      }
    }

    try {
      const result = await retry(
        async () => {
          let query = this.supabase
            .from("portfolio")
            .select(
              `
            id,
            title,
            brief_description,
            before_images,
            after_images,
            techniques,
            materials,
            is_featured,
            created_at
          `
            )
            .order("created_at", { ascending: false });

          if (limit) query = query.limit(limit);
          if (featured !== undefined) query = query.eq("is_featured", featured);
          if (status) query = query.eq("status", status);

          const { data, error } = await query;
          if (error) throw error;
          return data;
        },
        OPTIMIZATION_CONFIG.retryAttempts,
        OPTIMIZATION_CONFIG.retryDelay
      );

      // Cache successful results
      if (useCache && result) {
        queryCache.set(cacheKey, result);
      }

      dbLogger.debug(`Portfolio query completed: ${result?.length || 0} items`);
      return result;
    } catch (error) {
      dbLogger.error("Portfolio query failed", { metadata: error });
      throw error;
    }
  }

  /**
   * Optimized customer queries with pagination and search
   */
  async getCustomers(
    options: {
      limit?: number;
      offset?: number;
      search?: string;
      useCache?: boolean;
    } = {}
  ) {
    const { limit = 50, offset = 0, search, useCache = true } = options;
    const cacheKey = `customers_${limit}_${offset}_${search || "all"}`;

    if (useCache) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        dbLogger.debug(`Cache hit for customers query: ${cacheKey}`);
        return cached;
      }
    }

    try {
      const result = await retry(
        async () => {
          let query = this.supabase
            .from("customers")
            .select(
              `
            id,
            full_name,
            email,
            phone,
            customer_since,
            created_at
          `
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (search) {
            query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data;
        },
        OPTIMIZATION_CONFIG.retryAttempts,
        OPTIMIZATION_CONFIG.retryDelay
      );

      if (useCache && result) {
        queryCache.set(cacheKey, result, OPTIMIZATION_CONFIG.cacheTimeout);
      }

      dbLogger.debug(`Customers query completed: ${result?.length || 0} items`);
      return result;
    } catch (error) {
      dbLogger.error("Customers query failed", { metadata: error });
      throw error;
    }
  }

  /**
   * Batch load multiple portfolio items by IDs
   */
  async getPortfolioItemsByIds(ids: string[]): Promise<any[]> {
    return batchManager.batchQuery(
      "portfolio_by_ids",
      async (batchedIds: string[][]) => {
        const allIds = Array.from(new Set(batchedIds.flat()));

        const { data, error } = await this.supabase.from("portfolio").select("*").in("id", allIds);

        if (error) throw error;

        // Return results in the same order as requested
        return batchedIds.map((idBatch) =>
          idBatch.map((id) => data?.find((item) => item.id === id))
        );
      },
      ids
    );
  }

  /**
   * Get dashboard statistics with optimized parallel queries
   */
  async getDashboardStats(useCache: boolean = true) {
    const cacheKey = "dashboard_stats";

    if (useCache) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        dbLogger.debug("Cache hit for dashboard stats");
        return cached;
      }
    }

    try {
      // Run multiple queries in parallel for better performance
      const [portfolioCount, customersCount, inquiriesCount] = await Promise.all([
        this.supabase.from("portfolio").select("id", { count: "exact", head: true }),
        this.supabase.from("customers").select("id", { count: "exact", head: true }),
        this.supabase.from("inquiries").select("id", { count: "exact", head: true }),
      ]);

      const stats = {
        portfolioItems: portfolioCount.count || 0,
        customers: customersCount.count || 0,
        inquiries: inquiriesCount.count || 0,
        timestamp: new Date().toISOString(),
      };

      if (useCache) {
        queryCache.set(cacheKey, stats, 10 * 60 * 1000); // Cache for 10 minutes
      }

      dbLogger.debug("Dashboard stats query completed", { metadata: stats });
      return stats;
    } catch (error) {
      dbLogger.error("Dashboard stats query failed", { metadata: error });
      throw error;
    }
  }

  /**
   * Optimized search across multiple tables
   */
  async globalSearch(
    searchTerm: string,
    options: {
      tables?: string[];
      limit?: number;
      useCache?: boolean;
    } = {}
  ) {
    const { tables = ["portfolio", "customers"], limit = 20, useCache = true } = options;
    const cacheKey = `global_search_${searchTerm}_${tables.join("_")}_${limit}`;

    if (useCache) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        dbLogger.debug(`Cache hit for global search: ${searchTerm}`);
        return cached;
      }
    }

    try {
      const searchPromises = tables.map(async (table) => {
        switch (table) {
          case "portfolio":
            const { data: portfolioData } = await this.supabase
              .from("portfolio")
              .select("id, title, brief_description")
              .or(`title.ilike.%${searchTerm}%,brief_description.ilike.%${searchTerm}%`)
              .limit(limit);
            return portfolioData?.map((item) => ({ ...item, type: "portfolio" })) || [];

          case "customers":
            const { data: customerData } = await this.supabase
              .from("customers")
              .select("id, full_name, email")
              .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
              .limit(limit);
            return customerData?.map((item) => ({ ...item, type: "customer" })) || [];

          default:
            return [];
        }
      });

      const results = await Promise.all(searchPromises);
      const combinedResults = results.flat().slice(0, limit);

      if (useCache) {
        queryCache.set(cacheKey, combinedResults, 2 * 60 * 1000); // Cache for 2 minutes
      }

      dbLogger.debug(
        `Global search completed: ${combinedResults.length} results for "${searchTerm}"`
      );
      return combinedResults;
    } catch (error) {
      dbLogger.error("Global search failed", { metadata: error });
      throw error;
    }
  }

  /**
   * Cache management methods
   */
  invalidateCache(pattern?: string): void {
    queryCache.invalidate(pattern);
    dbLogger.debug(`Cache invalidated: ${pattern || "all"}`);
  }

  getCacheStats(): { size: number; config: typeof OPTIMIZATION_CONFIG } {
    return {
      size: queryCache.size(),
      config: OPTIMIZATION_CONFIG,
    };
  }

  /**
   * Execute raw SQL with optimization
   */
  async executeRawQuery(
    query: string,
    params: unknown[] = [],
    options: { useCache?: boolean; cacheKey?: string; cacheTtl?: number } = {}
  ) {
    const { useCache = false, cacheKey, cacheTtl = OPTIMIZATION_CONFIG.cacheTimeout } = options;

    if (useCache && cacheKey) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        dbLogger.debug(`Cache hit for raw query: ${cacheKey}`);
        return cached;
      }
    }

    try {
      const result = await retry(
        async () => {
          const { data, error } = await this.supabase.rpc("execute_sql", {
            query,
            params,
          });
          if (error) throw error;
          return data;
        },
        OPTIMIZATION_CONFIG.retryAttempts,
        OPTIMIZATION_CONFIG.retryDelay
      );

      if (useCache && cacheKey && result) {
        queryCache.set(cacheKey, result, cacheTtl);
      }

      dbLogger.debug("Raw query executed successfully");
      return result;
    } catch (error) {
      dbLogger.error("Raw query failed", { metadata: { query, error } });
      throw error;
    }
  }
}

// Export singleton instances
export const clientOptimizer = new DatabaseQueryOptimizer(false);
export const serverOptimizer = new DatabaseQueryOptimizer(true);

// Export cache utilities
export const cacheUtils = {
  invalidate: (pattern?: string) => queryCache.invalidate(pattern),
  stats: () => ({
    size: queryCache.size(),
    config: OPTIMIZATION_CONFIG,
  }),
  clear: () => queryCache.invalidate(),
};
