/**
 * Unified logger implementation for the ColorCraft application
 * Consolidates all logging functionality with performance monitoring
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogOptions {
  metadata?: any;
  context?: string;
  timestamp?: boolean;
}

interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
  rating?: 'good' | 'needs-improvement' | 'poor';
}

class UnifiedLogger {
  private prefix: string;
  private level: LogLevel;

  constructor(prefix: string = '', level: LogLevel = LogLevel.INFO) {
    this.prefix = prefix;
    this.level = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: string, message: string, options?: LogOptions): string {
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}]` : '';
    const context = options?.context ? `[${options.context}]` : '';
    const prefixPart = this.prefix ? `[${this.prefix}]` : '';

    return `${timestamp}[${level}]${prefixPart}${context} ${message}`;
  }

  debug(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, options), options?.metadata || '');
    }
  }

  info(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message, options), options?.metadata || '');
    }
  }

  warn(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, options), options?.metadata || '');
    }
  }

  error(message: string, options?: LogOptions): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, options), options?.metadata || '');
    }
  }

  // Performance monitoring methods
  async measurePerformance<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = Math.round(performance.now() - start);
      this.debug(`${label} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Math.round(performance.now() - start);
      this.error(`${label} failed after ${duration}ms: ${String(error)}`);
      throw error;
    }
  }

  // Core Web Vitals logging
  logWebVital(metric: PerformanceMetric): void {
    if (process.env.NODE_ENV === 'development') {
      this.info(`📊 ${metric.name}: ${metric.value.toFixed(2)}ms${metric.rating ? ` (${metric.rating})` : ''}`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // Analytics integration point
      try {
        // @ts-ignore - gtag may not be available
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      } catch (error) {
        this.warn('Failed to send analytics data', { metadata: error });
      }
    }
  }
}

// Create singleton instances for different parts of the application
export const logger = new UnifiedLogger();
export const apiLogger = new UnifiedLogger('API');
export const authLogger = new UnifiedLogger('AUTH');
export const dbLogger = new UnifiedLogger('DB');
export const perfLogger = new UnifiedLogger('PERF');

// Unified performance utilities
export const performanceUtils = {
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },

  measure: (name: string, startMark: string, endMark?: string): number => {
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
        logger.warn('Performance measurement failed', { metadata: error });
        return 0;
      }
    }
    return 0;
  },

  getEntries: () => {
    if (typeof window !== 'undefined' && window.performance) {
      return window.performance.getEntries();
    }
    return [];
  },

  clear: () => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.clearMarks();
      window.performance.clearMeasures();
    }
  },
};

// Legacy compatibility exports (to be removed gradually)
export const measurePerformance = logger.measurePerformance.bind(logger);
export const performanceMetrics = performanceUtils;
