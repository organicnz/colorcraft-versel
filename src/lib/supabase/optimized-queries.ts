import { createClient } from "./client";
import { createClient as createServerClient } from "./server";

// Cache for frequently accessed data
const queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL constants (in milliseconds)
const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
};

// Cache utility functions
function setCacheItem(key: string, data: any, ttl: number = CACHE_TTL.MEDIUM) {
  queryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

function getCacheItem(key: string) {
  const item = queryCache.get(key);
  if (!item) return null;

  if (Date.now() - item.timestamp > item.ttl) {
    queryCache.delete(key);
    return null;
  }

  return item.data;
}

function clearCache(pattern?: string) {
  if (pattern) {
    // Clear cache items matching pattern
    for (const key of queryCache.keys()) {
      if (key.includes(pattern)) {
        queryCache.delete(key);
      }
    }
  } else {
    // Clear all cache
    queryCache.clear();
  }
}

// Optimized query functions
export class OptimizedQueries {
  private supabase: ReturnType<typeof createClient> | ReturnType<typeof createServerClient>;

  constructor(isServer: boolean = false) {
    this.supabase = isServer ? createServerClient() : createClient();
  }

  // Portfolio queries with aggressive caching
  async getPortfolioItems(limit: number = 12, featured: boolean = false) {
    const cacheKey = `portfolio_${limit}_${featured}`;
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

    const query = this.supabase
      .from("portfolio_items")
      .select(
        `
        id,
        title,
        brief_description,
        after_images,
        techniques,
        is_featured,
        created_at
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (featured) {
      query.eq("is_featured", true);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Cache for 15 minutes (portfolio doesn't change often)
    setCacheItem(cacheKey, data, CACHE_TTL.MEDIUM);

    return data;
  }

  // Services with long caching
  async getServices() {
    const cacheKey = "services_active";
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

    const { data, error } = await this.supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Cache for 1 hour (services rarely change)
    setCacheItem(cacheKey, data, CACHE_TTL.LONG);

    return data;
  }

  // Customer queries (admin only, shorter cache)
  async getCustomers(limit: number = 50, search?: string) {
    const cacheKey = `customers_${limit}_${search || "all"}`;
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

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
      .limit(limit);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Cache for 5 minutes (customer data changes frequently)
    setCacheItem(cacheKey, data, CACHE_TTL.SHORT);

    return data;
  }

  // Inquiries with smart caching
  async getInquiries(status?: string, limit: number = 50) {
    const cacheKey = `inquiries_${status || "all"}_${limit}`;
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

    let query = this.supabase
      .from("inquiries")
      .select(
        `
        id,
        description,
        furniture_type,
        status,
        created_at,
        customers (
          id,
          full_name,
          email
        ),
        services (
          id,
          name
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Cache for 5 minutes (inquiries change frequently)
    setCacheItem(cacheKey, data, CACHE_TTL.SHORT);

    return data;
  }

  // Site content with very long caching
  async getSiteContent(contentId: string) {
    const cacheKey = `site_content_${contentId}`;
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

    const { data, error } = await this.supabase
      .from("site_content")
      .select("*")
      .eq("id", contentId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 is "not found"

    // Cache for 24 hours (site content rarely changes)
    setCacheItem(cacheKey, data, CACHE_TTL.VERY_LONG);

    return data;
  }

  // Statistics queries with medium caching
  async getDashboardStats() {
    const cacheKey = "dashboard_stats";
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

    // Run multiple queries in parallel for better performance
    const [customersResult, inquiriesResult, projectsResult, portfolioResult] = await Promise.all([
      this.supabase.from("customers").select("id", { count: "exact", head: true }),
      this.supabase.from("inquiries").select("id", { count: "exact", head: true }),
      this.supabase.from("client_projects").select("id", { count: "exact", head: true }),
      this.supabase.from("portfolio_items").select("id", { count: "exact", head: true }),
    ]);

    const stats = {
      totalCustomers: customersResult.count || 0,
      totalInquiries: inquiriesResult.count || 0,
      totalProjects: projectsResult.count || 0,
      totalPortfolioItems: portfolioResult.count || 0,
    };

    // Cache for 15 minutes
    setCacheItem(cacheKey, stats, CACHE_TTL.MEDIUM);

    return stats;
  }

  // Performance: Get recent activity efficiently
  async getRecentActivity(limit: number = 10) {
    const cacheKey = `recent_activity_${limit}`;
    const cached = getCacheItem(cacheKey);
    if (cached) return cached;

    // Use a more efficient approach with unions or views in production
    const { data: recentInquiries, error } = await this.supabase
      .from("inquiries")
      .select(
        `
        id,
        created_at,
        description,
        customers (full_name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const activity =
      recentInquiries?.map((inquiry) => ({
        id: inquiry.id,
        type: "inquiry",
        description: `New inquiry: ${inquiry.description}`,
        customer: inquiry.customers?.full_name,
        created_at: inquiry.created_at,
      })) || [];

    // Cache for 5 minutes
    setCacheItem(cacheKey, activity, CACHE_TTL.SHORT);

    return activity;
  }

  // Invalidate cache methods
  invalidatePortfolioCache() {
    clearCache("portfolio");
  }

  invalidateCustomerCache() {
    clearCache("customers");
  }

  invalidateInquiryCache() {
    clearCache("inquiries");
  }

  invalidateSiteContentCache() {
    clearCache("site_content");
  }

  invalidateAllCache() {
    clearCache();
  }
}

// Create instances for client and server use
export const clientQueries = new OptimizedQueries(false);
export const serverQueries = new OptimizedQueries(true);

// Export cache utilities for manual cache management
export { setCacheItem, getCacheItem, clearCache, CACHE_TTL };
