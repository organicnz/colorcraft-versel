/**
 * Simple logger implementation for the application
 */

interface LogOptions {
  metadata?: Record<string, any>;
}

class Logger {
  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  info(message: string, options?: LogOptions) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO]${this.prefix ? ` [${this.prefix}]` : ''} ${message}`, options?.metadata || '');
    }
  }

  warn(message: string, options?: LogOptions) {
    console.warn(`[WARN]${this.prefix ? ` [${this.prefix}]` : ''} ${message}`, options?.metadata || '');
  }

  error(message: string, options?: LogOptions) {
    console.error(`[ERROR]${this.prefix ? ` [${this.prefix}]` : ''} ${message}`, options?.metadata || '');
  }

  debug(message: string, options?: LogOptions) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG]${this.prefix ? ` [${this.prefix}]` : ''} ${message}`, options?.metadata || '');
    }
  }
}

// Create instances for different parts of the application
export const logger = new Logger();
export const apiLogger = new Logger('API');
export const authLogger = new Logger('Auth');
export const dbLogger = new Logger('DB');

/**
 * Track performance of operations
 * @param label Operation name
 * @param fn Function to measure
 * @returns Result of the function
 */
export async function measurePerformance<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = Math.round(performance.now() - start);
    logger.debug(`${label} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Math.round(performance.now() - start);
    logger.error(`${label} failed after ${duration}ms`, error);
    throw error;
  }
}
