import { db } from '@/lib/db';
import { feature_flags, FeatureFlag } from './schema';
import { eq, and } from 'drizzle-orm';
import { apiLogger } from '@/lib/logger';
import { errorMonitor } from '@/lib/errors/monitoring';
import { cache } from 'react';

/**
 * Feature flag environment types
 */
export type Environment = 'development' | 'staging' | 'production' | 'all';

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
}

/**
 * In-memory cache of feature flags
 * Used to prevent excessive database queries
 */
const featureFlagCache = new Map<string, { value: boolean; timestamp: number }>();

/**
 * Time-to-live for cached flags in milliseconds (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Clear all cached feature flags
 */
export function clearFeatureFlagCache(): void {
  featureFlagCache.clear();
}

/**
 * Check if a feature flag is enabled
 * This function is server-side only
 */
export async function isFeatureEnabled(
  featureConfig: FeatureConfig,
  context?: { userId?: string; environment?: Environment }
): Promise<boolean> {
  const environment = context?.environment || getEnvironment();
  const featureName = featureConfig.name;
  const cacheKey = `${featureName}:${environment}:${context?.userId || 'global'}`;
  
  try {
    // Check cache first
    const cachedValue = featureFlagCache.get(cacheKey);
    if (cachedValue && (Date.now() - cachedValue.timestamp) < CACHE_TTL) {
      return cachedValue.value;
    }
    
    // Should this flag apply to the current environment?
    if (
      featureConfig.environments && 
      featureConfig.environments.length > 0 &&
      !featureConfig.environments.includes('all') &&
      !featureConfig.environments.includes(environment)
    ) {
      // Not applicable to this environment, use default
      const value = featureConfig.defaultValue;
      featureFlagCache.set(cacheKey, { value, timestamp: Date.now() });
      return value;
    }
    
    // Query the database for the flag
    const [flag] = await db
      .select()
      .from(feature_flags)
      .where(
        and(
          eq(feature_flags.name, featureName),
          eq(feature_flags.environment, environment)
        )
      )
      .limit(1);
    
    let isEnabled: boolean;
    
    if (flag) {
      // We have a flag in the database
      isEnabled = flag.is_enabled;
      
      // Check user-specific targeting if a userId is provided
      if (context?.userId && flag.user_targeting) {
        try {
          const userTargeting = JSON.parse(flag.user_targeting);
          if (Array.isArray(userTargeting.include_users)) {
            // User is explicitly included
            if (userTargeting.include_users.includes(context.userId)) {
              isEnabled = true;
            }
          }
          if (Array.isArray(userTargeting.exclude_users)) {
            // User is explicitly excluded
            if (userTargeting.exclude_users.includes(context.userId)) {
              isEnabled = false;
            }
          }
          // Percentage rollout
          if (typeof userTargeting.percentage === 'number' && userTargeting.percentage >= 0 && userTargeting.percentage <= 100) {
            // Deterministic pseudo-random assignment based on user ID
            const userHash = hashString(context.userId) % 100;
            isEnabled = userHash < userTargeting.percentage;
          }
        } catch (e) {
          apiLogger.warn(`Invalid user targeting for feature: ${featureName}`, { 
            metadata: { error: (e as Error).message } 
          });
        }
      }
    } else {
      // No flag in database, use default
      isEnabled = featureConfig.defaultValue;
    }
    
    // Cache the result
    featureFlagCache.set(cacheKey, { value: isEnabled, timestamp: Date.now() });
    return isEnabled;
  } catch (error) {
    errorMonitor.captureError(error as Error, {
      context: 'isFeatureEnabled',
      feature: featureName,
      environment,
    });
    // On error, fall back to default value
    return featureConfig.defaultValue;
  }
}

/**
 * Check if a feature flag is enabled (React Server Component cached version)
 * This uses React cache() to deduplicate requests within the same RSC tree
 */
export const getFeatureFlag = cache(async (
  featureConfig: FeatureConfig,
  context?: { userId?: string; environment?: Environment }
): Promise<boolean> => {
  return isFeatureEnabled(featureConfig, context);
});

/**
 * Create or update a feature flag
 */
export async function setFeatureFlag(
  feature: Pick<FeatureFlag, 'name' | 'is_enabled' | 'description'>,
  environment: Environment = 'development'
): Promise<FeatureFlag> {
  try {
    // Check if flag exists
    const [existingFlag] = await db
      .select()
      .from(feature_flags)
      .where(
        and(
          eq(feature_flags.name, feature.name),
          eq(feature_flags.environment, environment)
        )
      )
      .limit(1);
    
    let flag: FeatureFlag;
    
    if (existingFlag) {
      // Update existing flag
      const [updatedFlag] = await db
        .update(feature_flags)
        .set({
          is_enabled: feature.is_enabled,
          description: feature.description,
          updated_at: new Date(),
        })
        .where(eq(feature_flags.id, existingFlag.id))
        .returning();
      
      flag = updatedFlag;
    } else {
      // Create new flag
      const [newFlag] = await db
        .insert(feature_flags)
        .values({
          name: feature.name,
          is_enabled: feature.is_enabled,
          description: feature.description,
          environment,
        })
        .returning();
      
      flag = newFlag;
    }
    
    // Clear the cache for this flag
    clearFeatureFlagCache();
    
    return flag;
  } catch (error) {
    errorMonitor.captureError(error as Error, {
      context: 'setFeatureFlag',
      feature: feature.name,
      environment,
    });
    throw error;
  }
}

/**
 * Delete a feature flag
 */
export async function deleteFeatureFlag(name: string, environment: Environment = 'development'): Promise<void> {
  try {
    await db
      .delete(feature_flags)
      .where(
        and(
          eq(feature_flags.name, name),
          eq(feature_flags.environment, environment)
        )
      );
    
    // Clear the cache for this flag
    clearFeatureFlagCache();
  } catch (error) {
    errorMonitor.captureError(error as Error, {
      context: 'deleteFeatureFlag',
      feature: name,
      environment,
    });
    throw error;
  }
}

/**
 * Get the current environment
 */
function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') return 'production';
  if (env === 'test') return 'development';
  return 'development';
}

/**
 * Simple string hash function for deterministic flag assignment
 */
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash);
}

/**
 * Type definition for a feature flag configuration
 */
export type FeatureConfig = {
  /** Unique name of the feature */
  name: string;
  /** Short description of what the feature does */
  description: string;
  /** Default value when the feature flag cannot be determined */
  defaultValue: boolean;
  /** The environments where this feature is available */
  environments: Array<"development" | "staging" | "production">;
};

/**
 * Feature flags configuration
 */
export const FEATURE_FLAGS = {
  /**
   * Dark mode feature for the UI
   */
  DARK_MODE: {
    name: "dark_mode",
    description: "Enables dark mode theme for the website",
    defaultValue: true,
    environments: ["development", "staging", "production"],
  } as FeatureConfig,

  /**
   * Enhanced contact form with additional fields and scheduling options
   */
  ENHANCED_CONTACT_FORM: {
    name: "enhanced_contact_form",
    description: "Enables advanced contact form features including scheduling",
    defaultValue: false,
    environments: ["development", "staging"],
  } as FeatureConfig,

  /**
   * Dashboard analytics feature
   */
  DASHBOARD_ANALYTICS: {
    name: "dashboard_analytics",
    description: "Displays analytics dashboard for admin users",
    defaultValue: true,
    environments: ["development", "staging", "production"],
  } as FeatureConfig,
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
  const environment = process.env.NODE_ENV === "production" 
    ? "production"
    : process.env.VERCEL_ENV === "preview" 
      ? "staging" 
      : "development";
  
  // Check if feature is enabled for current environment
  return feature.environments.includes(environment as any) 
    ? feature.defaultValue 
    : false;
}
