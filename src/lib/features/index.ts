import { db } from "@/lib/db";
import { feature_flags, FeatureFlag } from "./schema";
import { eq, and } from "drizzle-orm";
import { apiLogger } from "@/lib/logger";
import { errorMonitor } from "@/lib/errors/monitoring";
import { cache } from "react";
import { FeatureDefinition } from "./feature-list";
import { hashString } from "../utils";
import { logger } from "../logger";

/**
 * Feature flag environment types
 */
export type Environment = "development" | "staging" | "production" | "all";

/**
 * Feature flag configuration
 */
export interface FeatureConfig {
  /** Unique feature identifier */
  name: string;
  /** Default value if flag doesn't exist in DB */
  defaultValue: boolean;
  /** Which environments this flag applies to */
  environments?: Environment[];
  /** Description of the feature */
  description?: string;
  enabled: boolean;
  rolloutPercentage?: number;
  userIds?: string[];
}

/**
 * Consolidated Feature Flag System
 * Manages feature toggles with caching and user-based assignment
 */

/**
 * In-memory cache of feature flags with TTL
 */
class FeatureFlagCache {
  private cache = new Map<string, { value: boolean; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: boolean): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  get(key: string): boolean | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const featureFlagCache = new FeatureFlagCache();

/**
 * Check if user is in rollout percentage
 */
function isUserInRollout(userId: string, percentage: number): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;

  const hash = hashString(userId);
  return hash % 100 < percentage;
}

/**
 * Check if feature is enabled for current environment
 */
function isEnvironmentMatch(environment?: string): boolean {
  if (!environment || environment === "all") return true;
  return process.env.NODE_ENV === environment || process.env.VERCEL_ENV === environment;
}

/**
 * Core function to check if a feature flag is enabled
 */
export function isFeatureEnabled(
  flagName: string,
  userId?: string,
  context?: Record<string, any>
): boolean {
  // Check cache first
  const cacheKey = `${flagName}_${userId || "anonymous"}`;
  const cached = featureFlagCache.get(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const config = FEATURE_FLAGS[flagName];

  // Feature doesn't exist
  if (!config) {
    logger.warn(`Feature flag '${flagName}' not found`);
    featureFlagCache.set(cacheKey, false);
    return false;
  }

  // Check environment
  if (!isEnvironmentMatch(config.environment)) {
    featureFlagCache.set(cacheKey, false);
    return false;
  }

  // Feature is disabled
  if (!config.enabled) {
    featureFlagCache.set(cacheKey, false);
    return false;
  }

  // Check specific user IDs
  if (userId && config.userIds?.includes(userId)) {
    featureFlagCache.set(cacheKey, true);
    return true;
  }

  // Check rollout percentage
  if (userId && config.rolloutPercentage !== undefined) {
    const inRollout = isUserInRollout(userId, config.rolloutPercentage);
    featureFlagCache.set(cacheKey, inRollout);
    return inRollout;
  }

  // Default to enabled if no specific rules
  const enabled = config.enabled;
  featureFlagCache.set(cacheKey, enabled);
  return enabled;
}

/**
 * Get all feature flags for a user
 */
export function getAllFeatureFlags(userId?: string): Record<string, boolean> {
  const flags: Record<string, boolean> = {};

  for (const flagName in FEATURE_FLAGS) {
    flags[flagName] = isFeatureEnabled(flagName, userId);
  }

  return flags;
}

/**
 * Clear feature flag cache
 */
export function clearFeatureFlagCache(): void {
  featureFlagCache.clear();
  logger.debug("Feature flag cache cleared");
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; ttl: number } {
  return {
    size: featureFlagCache.size(),
    ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
  };
}

/**
 * Add or update a feature flag at runtime
 */
export function setFeatureFlag(flagName: string, config: FeatureConfig): void {
  FEATURE_FLAGS[flagName] = config;
  // Clear related cache entries
  featureFlagCache.clear();
  logger.info(`Feature flag '${flagName}' updated`);
}

/**
 * Remove a feature flag
 */
export function removeFeatureFlag(flagName: string): boolean {
  if (flagName in FEATURE_FLAGS) {
    delete FEATURE_FLAGS[flagName];
    featureFlagCache.clear();
    logger.info(`Feature flag '${flagName}' removed`);
    return true;
  }
  return false;
}

/**
 * List all available feature flags with their configurations
 */
export function listFeatureFlags(): Record<string, FeatureConfig> {
  return { ...FEATURE_FLAGS };
}

/**
 * Feature flags configuration
 */
export const FEATURE_FLAGS: Record<string, FeatureConfig> = {
  /**
   * Dark mode feature for the UI
   */
  DARK_MODE: {
    name: "dark_mode",
    description: "Enables dark mode theme for the website",
    defaultValue: true,
    environments: ["development", "staging", "production"],
    enabled: true,
  },

  /**
   * Enhanced contact form with additional fields and scheduling options
   */
  ENHANCED_CONTACT_FORM: {
    name: "enhanced_contact_form",
    description: "Enables advanced contact form features including scheduling",
    defaultValue: false,
    environments: ["development", "staging"],
    enabled: true,
  },

  /**
   * Dashboard analytics feature
   */
  DASHBOARD_ANALYTICS: {
    name: "dashboard_analytics",
    description: "Displays analytics dashboard for admin users",
    defaultValue: true,
    environments: ["development", "staging", "production"],
    enabled: true,
  },

  "portfolio-management-v2": {
    enabled: true,
    description: "New portfolio management interface",
    environment: "all",
  },
  "enhanced-chat-system": {
    enabled: true,
    rolloutPercentage: 100,
    description: "Enhanced chat system with real-time messaging",
    environment: "all",
  },
  "advanced-analytics": {
    enabled: false,
    rolloutPercentage: 25,
    description: "Advanced analytics dashboard",
    environment: "production",
  },
  "beta-features": {
    enabled: process.env.NODE_ENV === "development",
    description: "Beta features for testing",
    environment: "development",
  },
};

/**
 * Checks if a feature flag is enabled based on environment only
 * A simplified version for quick checks without database lookup
 * For use in server components or API routes
 *
 * @param feature The feature flag to check
 * @returns boolean indicating if the feature is enabled based on environment
 */
export function isFeatureEnabledByEnvironment(feature: FeatureConfig): boolean {
  // Determine current environment
  const environment =
    process.env.NODE_ENV === "production"
      ? "production"
      : process.env.VERCEL_ENV === "preview"
        ? "staging"
        : "development";

  // Check if feature is enabled for current environment
  return feature.environments.includes(environment as any) ? feature.defaultValue : false;
}
