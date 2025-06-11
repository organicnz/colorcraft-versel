"use client";

import { useState, useEffect } from 'react';
import { isFeatureEnabled } from './index';

// Remove unused cache and fetch function

type UseFeatureFlagResult = {
  enabled: boolean;
  loading: boolean;
};

/**
 * React hook for checking if a feature flag is enabled in client components
 * 
 * @param flagName The name of the feature flag
 * @param userId The user ID for personalized feature flags
 * @returns Object containing the enabled status and loading state
 * 
 * @example
 * ```tsx
 * const { enabled } = useFeatureFlag(FEATURE_FLAGS.DARK_MODE);
 * 
 * return (
 *   <div className={enabled ? "dark-theme" : "light-theme"}>
 *     Content goes here
 *   </div>
 * );
 * ```
 */
export function useFeatureFlag(
  flagName: string, 
  userId?: string
): UseFeatureFlagResult {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const isEnabled = isFeatureEnabled(flagName, userId);
      setEnabled(isEnabled);
    } catch (error) {
      console.warn(`Error checking feature flag '${flagName}':`, error);
      setEnabled(false);
    } finally {
      setLoading(false);
    }
  }, [flagName, userId]);

  return { enabled, loading };
}
