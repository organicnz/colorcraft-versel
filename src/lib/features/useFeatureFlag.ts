"use client";

import { useState, useEffect } from "react";
import { isFeatureEnabled } from "./index";

// Remove unused cache and fetch function

type UseFeatureFlagResult = {
  enabled: boolean;
  loading: boolean;
};

/**
 * Hook to check if a feature flag is enabled
 * @param flagName - The name of the feature flag to check
 * @returns Object containing enabled state and loading state
 */
export function useFeatureFlag(flagName: string): UseFeatureFlagResult {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFlag = async () => {
      setLoading(true);
      try {
        const flagEnabled = await isFeatureEnabled(flagName);
        setEnabled(flagEnabled);
      } catch (error) {
        console.warn(`Failed to check feature flag "${flagName}":`, error);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkFlag();
  }, [flagName]);

  return { enabled, loading };
}
