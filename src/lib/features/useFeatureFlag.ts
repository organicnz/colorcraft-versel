import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FeatureConfig } from './index';

// Flag cache to avoid unnecessary API calls within a session
const clientFlagCache = new Map<string, boolean>();

/**
 * API route to check feature flag status
 * This allows us to check feature flags on the client side
 */
async function fetchFeatureFlag(feature: FeatureConfig, userId?: string): Promise<boolean> {
  // First check the in-memory cache for immediate results
  const cacheKey = `${feature.name}:${userId || 'anonymous'}`;
  if (clientFlagCache.has(cacheKey)) {
    return clientFlagCache.get(cacheKey) as boolean;
  }
  
  try {
    const params = new URLSearchParams({
      feature: feature.name,
    });
    
    if (userId) {
      params.append('userId', userId);
    }
    
    const response = await fetch(`/api/features?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch feature flag');
    }
    
    const data = await response.json();
    
    // Cache the result
    clientFlagCache.set(cacheKey, data.enabled);
    return data.enabled;
  } catch (error) {
    console.error('Error fetching feature flag:', error);
    // Return default value on error
    return feature.defaultValue;
  }
}

/**
 * Hook for checking if a feature flag is enabled in client components
 * 
 * @example
 * ```tsx
 * import { FEATURES } from '@/lib/features/schema';
 * 
 * function MyComponent() {
 *   const isNewUIEnabled = useFeatureFlag(FEATURES.NEW_DASHBOARD_UI);
 *   
 *   return (
 *     <div>
 *       {isNewUIEnabled ? (
 *         <NewDashboard />
 *       ) : (
 *         <LegacyDashboard />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFeatureFlag(
  feature: FeatureConfig,
  options?: {
    userId?: string;
    initialValue?: boolean;
    queryOptions?: {
      enabled?: boolean;
      refetchInterval?: number;
      refetchOnWindowFocus?: boolean;
    };
  }
) {
  // Use the provided initial value or fall back to the feature's default value
  const [enabled, setEnabled] = useState(options?.initialValue ?? feature.defaultValue);
  
  const { data, isLoading } = useQuery({
    queryKey: ['featureFlag', feature.name, options?.userId],
    queryFn: () => fetchFeatureFlag(feature, options?.userId),
    // Default options with reasonable defaults
    ...{
      // Refetch every 5 minutes by default
      refetchInterval: 5 * 60 * 1000,
      // Don't refetch on window focus by default to reduce API calls
      refetchOnWindowFocus: false,
      // Query is enabled by default
      enabled: true,
      // Use cached data first
      staleTime: 2 * 60 * 1000,
      ...options?.queryOptions,
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setEnabled(data);
    }
  }, [data]);

  return {
    /** Whether the feature is enabled */
    enabled,
    /** Whether the feature flag is still loading */
    isLoading,
    /** Force-clear the client cache for this flag */
    clearCache: () => {
      const cacheKey = `${feature.name}:${options?.userId || 'anonymous'}`;
      clientFlagCache.delete(cacheKey);
    },
  };
}

/**
 * Clear all cached feature flags on the client
 */
export function clearFeatureFlagClientCache(): void {
  clientFlagCache.clear();
}
