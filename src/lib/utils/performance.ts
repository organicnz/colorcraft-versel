import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { debounce as debounceUtil } from "@/lib/utils";

// Get the performance object with fallback for environments without it
const performance = globalThis.performance || {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
  getEntriesByType: () => [],
  getEntriesByName: () => [],
  clearMarks: () => {},
  clearMeasures: () => {},
};

// Batch performance operations for better efficiency
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number> = new Map();
  private batchTimer: NodeJS.Timeout | null = null;
  private pendingOperations: Array<() => void> = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Throttle function for performance optimization
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Efficient debounce implementation
  debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    return debounceUtil(func, wait);
  }

  // Mark performance timing
  mark(name: string): void {
    this.measurements.set(name, performance.now());
    this.batchOperation(() => performance.mark(name));
  }

  // Measure performance between two marks
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.measurements.get(startMark);
    const endTime = endMark ? this.measurements.get(endMark) : performance.now();

    if (startTime === undefined) {
      console.warn(`Performance mark '${startMark}' not found`);
      return 0;
    }

    const duration = (endTime || performance.now()) - startTime;
    this.batchOperation(() => {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
    });

    return duration;
  }

  // Batch operations to reduce performance overhead
  private batchOperation(operation: () => void): void {
    this.pendingOperations.push(operation);

    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.pendingOperations.forEach((op) => op());
        this.pendingOperations = [];
        this.batchTimer = null;
      }, 16); // Next frame
    }
  }

  // Get performance entries efficiently
  getEntries(type?: string): PerformanceEntry[] {
    if (type) {
      return performance.getEntriesByType(type);
    }
    return [];
  }

  // Clear measurements
  clear(name?: string): void {
    if (name) {
      this.measurements.delete(name);
      performance.clearMarks(name);
      performance.clearMeasures(name);
    } else {
      this.measurements.clear();
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Hook for component performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  const renderCount = useRef(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Track component renders
  useEffect(() => {
    renderCount.current += 1;
  });

  const startMeasurement = useCallback(
    (name: string) => {
      monitor.mark(`${name}-start`);
      setIsMonitoring(true);
    },
    [monitor]
  );

  const endMeasurement = useCallback(
    (name: string) => {
      const duration = monitor.measure(name, `${name}-start`);
      setIsMonitoring(false);
      return duration;
    },
    [monitor]
  );

  const measureAsync = useCallback(
    async <T>(
      name: string,
      asyncFn: () => Promise<T>
    ): Promise<{ result: T; duration: number }> => {
      startMeasurement(name);
      try {
        const result = await asyncFn();
        const duration = endMeasurement(name);
        return { result, duration };
      } catch (error) {
        endMeasurement(name);
        throw error;
      }
    },
    [startMeasurement, endMeasurement]
  );

  return {
    startMeasurement,
    endMeasurement,
    measureAsync,
    renderCount: renderCount.current,
    isMonitoring,
    monitor,
  };
}

// Resource loading performance hook
export function useResourcePerformance() {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  }>({
    loadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMetrics = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");
      const lcp = performance.getEntriesByType("largest-contentful-paint")[0] as PerformanceEntry;

      if (navigation) {
        setMetrics((prev) => ({
          ...prev,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        }));
      }

      if (paint.length > 0) {
        const fcp = paint.find((entry) => entry.name === "first-contentful-paint");
        if (fcp) {
          setMetrics((prev) => ({
            ...prev,
            firstContentfulPaint: fcp.startTime,
          }));
        }
      }

      if (lcp) {
        setMetrics((prev) => ({
          ...prev,
          largestContentfulPaint: lcp.startTime,
        }));
      }
    };

    // Update immediately if data is available
    updateMetrics();

    // Also listen for load event
    const handleLoad = () => setTimeout(updateMetrics, 100);
    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return metrics;
}

// Memory performance monitoring
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMemoryInfo = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Memoization with expiration
export function memoizeWithTTL<T extends (...args: unknown[]) => any>(
  fn: T,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);

    if (cached && now - cached.timestamp < ttl) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });

    // Clean up expired entries
    for (const [k, v] of cache.entries()) {
      if (now - v.timestamp >= ttl) {
        cache.delete(k);
      }
    }

    return result;
  }) as T;
}

// React hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// React hook for throttled values
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return { isIntersecting, entry, elementRef };
}

// Hook for optimized event listeners
export function useOptimizedEventListener<T extends keyof WindowEventMap>(
  event: T,
  handler: (event: WindowEventMap[T]) => void,
  options: { debounce?: number; throttle?: number } = {}
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const optimizedHandler = useMemo(() => {
    let fn = (event: WindowEventMap[T]) => handlerRef.current(event);

    if (options.debounce) {
      fn = debounceUtil(fn, options.debounce);
    } else if (options.throttle) {
      const monitor = PerformanceMonitor.getInstance();
      fn = monitor.throttle(fn, options.throttle);
    }

    return fn;
  }, [options.debounce, options.throttle]);

  useEffect(() => {
    window.addEventListener(event, optimizedHandler as any);
    return () => window.removeEventListener(event, optimizedHandler as any);
  }, [event, optimizedHandler]);
}

// Memory-efficient array operations
export const arrayUtils = {
  // Chunk array into smaller pieces for better performance
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // Virtual scrolling helper
  getVisibleItems: <T>(
    items: T[],
    startIndex: number,
    endIndex: number
  ): { items: T[]; startIndex: number; endIndex: number } => {
    const start = Math.max(0, startIndex);
    const end = Math.min(items.length, endIndex);
    return {
      items: items.slice(start, end),
      startIndex: start,
      endIndex: end,
    };
  },
};

// Image optimization utilities
export const imageUtils = {
  // Generate optimized image URLs
  getOptimizedImageUrl: (
    src: string,
    width: number,
    height?: number,
    quality: number = 75
  ): string => {
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      return src;
    }

    const url = new URL(src, window.location.origin);
    url.searchParams.set("w", width.toString());
    url.searchParams.set("q", quality.toString());

    if (height) {
      url.searchParams.set("h", height.toString());
    }

    return url.toString();
  },

  // Preload critical images
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  },
};
