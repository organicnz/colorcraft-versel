import { useCallback, useMemo, useRef, useEffect } from 'react';

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function for performance optimization
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization with expiration
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): T {
  const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cache.get(key);
    
    if (cached && (now - cached.timestamp) < ttl) {
      return cached.value;
    }
    
    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });
    
    // Clean up expired entries
    for (const [k, v] of cache.entries()) {
      if ((now - v.timestamp) >= ttl) {
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
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);
  
  return throttledValue;
}

// Performance measurement utilities
export const performanceUtils = {
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },
  
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
        
        const measurement = window.performance.getEntriesByName(name)[0];
        return measurement?.duration || 0;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },
  
  clear: () => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  }
};

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
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
        rootMargin: '50px',
        ...options
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
      fn = debounce(fn, options.debounce);
    } else if (options.throttle) {
      fn = throttle(fn, options.throttle);
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
      endIndex: end
    };
  }
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
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      return src;
    }
    
    const url = new URL(src, window.location.origin);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', quality.toString());
    
    if (height) {
      url.searchParams.set('h', height.toString());
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
  }
};

// Import missing useState
import { useState } from 'react'; 