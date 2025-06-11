"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { performanceUtils, perfLogger } from "@/lib/logger";

// Types for performance monitoring
interface CoreWebVital {
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
}

// Performance thresholds for Core Web Vitals
const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// Rate performance based on thresholds
function rateWebVital(name: CoreWebVital["name"], value: number): CoreWebVital["rating"] {
  const thresholds = WEB_VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

// Hook for measuring component performance
export function usePerformanceMeasure(componentName: string) {
  const startTimeRef = useRef<number>();

  const startMeasure = useCallback(() => {
    startTimeRef.current = performance.now();
    performanceUtils.mark(`${componentName}-start`);
  }, [componentName]);

  const endMeasure = useCallback(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current;
      performanceUtils.mark(`${componentName}-end`);
      const measureDuration = performanceUtils.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      );

      perfLogger.debug(`${componentName} render time: ${duration.toFixed(2)}ms`);

      if (duration > 100) {
        perfLogger.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
      }

      return duration;
    }
    return 0;
  }, [componentName]);

  useEffect(() => {
    startMeasure();
    return () => {
      endMeasure();
    };
  }, [startMeasure, endMeasure]);

  return { startMeasure, endMeasure };
}

// Hook for Core Web Vitals monitoring
export function useWebVitals() {
  const metricsRef = useRef<Map<string, CoreWebVital>>(new Map());

  const recordWebVital = useCallback((metric: Omit<CoreWebVital, "rating">) => {
    const rating = rateWebVital(metric.name, metric.value);
    const fullMetric: CoreWebVital = { ...metric, rating };

    metricsRef.current.set(metric.name, fullMetric);

    // Log using unified logger
    perfLogger.info(`📊 ${metric.name}: ${metric.value.toFixed(2)}ms (${rating})`);

    // Send to analytics in production via unified logger
    perfLogger.logWebVital(fullMetric);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Dynamic import to avoid SSR issues
    const initWebVitals = async () => {
      try {
        const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import("web-vitals");

        onCLS(recordWebVital);
        onFID(recordWebVital);
        onFCP(recordWebVital);
        onLCP(recordWebVital);
        onTTFB(recordWebVital);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          perfLogger.warn("Web Vitals library not available", { metadata: error });
        }
      }
    };

    initWebVitals();
  }, [recordWebVital]);

  const getMetrics = useCallback(() => {
    return Array.from(metricsRef.current.values());
  }, []);

  const getMetricsByRating = useCallback((rating: CoreWebVital["rating"]) => {
    return Array.from(metricsRef.current.values()).filter((m) => m.rating === rating);
  }, []);

  return {
    getMetrics,
    getMetricsByRating,
    recordWebVital,
  };
}

// Hook for API performance tracking
export function useApiPerformance() {
  const trackApiCall = useCallback(
    async <T>(endpoint: string, apiCall: () => Promise<T>): Promise<T> => {
      const startTime = performance.now();
      const operationName = `API: ${endpoint}`;

      try {
        performanceUtils.mark(`${operationName}-start`);
        const result = await apiCall();
        const duration = performance.now() - startTime;

        performanceUtils.mark(`${operationName}-end`);
        performanceUtils.measure(operationName, `${operationName}-start`, `${operationName}-end`);

        perfLogger.debug(`${operationName} completed in ${duration.toFixed(2)}ms`);

        if (duration > 2000) {
          perfLogger.warn(`Slow API call detected: ${endpoint} took ${duration.toFixed(2)}ms`);
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        perfLogger.error(`${operationName} failed after ${duration.toFixed(2)}ms`, {
          metadata: error,
        });
        throw error;
      }
    },
    []
  );

  return { trackApiCall };
}

// Hook for memory usage monitoring
export function useMemoryMonitor() {
  const checkMemoryUsage = useCallback(() => {
    if (typeof window !== "undefined" && "memory" in performance) {
      const memory = (performance as any).memory;
      const usedMemory = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
      const totalMemory = Math.round(memory.totalJSHeapSize / 1048576);

      perfLogger.debug(`Memory usage: ${usedMemory}MB / ${totalMemory}MB`);

      if (usedMemory > 100) {
        perfLogger.warn(`High memory usage detected: ${usedMemory}MB`);
      }

      return { used: usedMemory, total: totalMemory };
    }
    return null;
  }, []);

  useEffect(() => {
    // Check memory usage every 30 seconds in development
    if (process.env.NODE_ENV === "development") {
      const interval = setInterval(checkMemoryUsage, 30000);
      return () => clearInterval(interval);
    }
  }, [checkMemoryUsage]);

  return { checkMemoryUsage };
}

interface PerformanceMetrics {
  fcp?: number
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
}

interface PerformanceData {
  metrics: PerformanceMetrics
  isLoading: boolean
  error: string | null
}

export function usePerformance(): PerformanceData {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const startTimeRef = useRef<number>(0)

  // Measure component render time
  const measureRenderTime = useCallback(() => {
    const now = performance.now()
    const renderTime = now - startTimeRef.current

    if (renderTime > 100) {
      console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`)
    }

    return renderTime
  }, [])

  // Initialize web vitals tracking
  useEffect(() => {
    startTimeRef.current = performance.now()

    async function initWebVitals() {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import("web-vitals")

        getCLS((metric) => {
          setMetrics(prev => ({ ...prev, cls: metric.value }))
        })

        getFID((metric) => {
          setMetrics(prev => ({ ...prev, fid: metric.value }))
        })

        getFCP((metric) => {
          setMetrics(prev => ({ ...prev, fcp: metric.value }))
        })

        getLCP((metric) => {
          setMetrics(prev => ({ ...prev, lcp: metric.value }))
        })

        getTTFB((metric) => {
          setMetrics(prev => ({ ...prev, ttfb: metric.value }))
        })

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load web vitals')
        setIsLoading(false)
      }
    }

    initWebVitals()
  }, [])

  return {
    metrics,
    isLoading,
    error
  }
}
