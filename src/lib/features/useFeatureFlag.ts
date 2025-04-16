"use client";

import { useState, useEffect } from 'react';
import { FeatureConfig } from './index';

// Remove unused cache and fetch function

type UseFeatureFlagResult = {
  enabled: boolean;
  loading: boolean;
};

/**
 * React hook for checking if a feature flag is enabled in client components
 * 
 * @param feature The feature flag configuration object
 * @returns Object containing the enabled status and loading state
 * 
 * @example
 * ```tsx
 * const { enabled } = useFeatureFlag(FEATURE_FLAGS.DARK_MODE);
 * 
 * return (
 *   <div className={enabled ? "dark-theme" : "light-theme"}>
 *     {/* Component content */}
 *   </div>
 * );
 * ```
 */
export function useFeatureFlag(feature: FeatureConfig): UseFeatureFlagResult {
  const [result, setResult] = useState<UseFeatureFlagResult>({
    enabled: feature.defaultValue,
    loading: true,
  });

  useEffect(() => {
    const checkFeatureStatus = async () => {
      try {
        // Determine current environment
        const environment = process.env.NODE_ENV === "production" 
          ? "production"
          : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" 
            ? "staging" 
            : "development";

        // Check if feature is enabled for current environment
        const isEnabled = feature.environments.includes(environment as any) 
          ? feature.defaultValue 
          : false;

        setResult({
          enabled: isEnabled,
          loading: false,
        });
      } catch (error) {
        console.error(`Error checking feature flag status for ${feature.name}:`, error);
        setResult({
          enabled: feature.defaultValue, // Fall back to default value
          loading: false,
        });
      }
    };

    checkFeatureStatus();
  }, [feature]);

  return result;
}
