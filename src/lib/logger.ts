/**
 * Logger utility for consistent logging across the application
 * Provides structured logging with severity levels and contextual information
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  timestamp?: boolean;
  metadata?: Record<string, any>;
}

/**
 * Default options for logging
 */
const defaultOptions: LogOptions = {
  timestamp: true,
};

/**
 * Formats a log message with timestamp and context
 */
function formatMessage(message: string, options: LogOptions = {}): string {
  const opts = { ...defaultOptions, ...options };
  const parts: string[] = [];
  
  if (opts.timestamp) {
    parts.push(`[${new Date().toISOString()}]`);
  }
  
  if (opts.context) {
    parts.push(`[${opts.context}]`);
  }
  
  parts.push(message);
  
  if (opts.metadata) {
    try {
      parts.push(JSON.stringify(opts.metadata));
    } catch (e) {
      parts.push(`[Metadata serialization failed: ${e}]`);
    }
  }
  
  return parts.join(' ');
}

/**
 * Log with debug level
 */
function debug(message: string, options: LogOptions = {}): void {
  if (process.env.NODE_ENV === 'production') return; // Skip in production
  console.debug(formatMessage(message, { ...options, context: options.context || 'DEBUG' }));
}

/**
 * Log with info level
 */
function info(message: string, options: LogOptions = {}): void {
  console.info(formatMessage(message, { ...options, context: options.context || 'INFO' }));
}

/**
 * Log with warning level
 */
function warn(message: string, options: LogOptions = {}): void {
  console.warn(formatMessage(message, { ...options, context: options.context || 'WARN' }));
}

/**
 * Log with error level
 */
function error(message: string, error?: any, options: LogOptions = {}): void {
  const metadata = { ...(options.metadata || {}) };
  
  // Add error details if present
  if (error) {
    metadata.error = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error.code ? { code: error.code } : {}),
    };
  }
  
  console.error(
    formatMessage(message, { 
      ...options, 
      context: options.context || 'ERROR',
      metadata
    })
  );
}

/**
 * Create a logger with a specific context
 */
function createContextLogger(context: string) {
  return {
    debug: (message: string, options: LogOptions = {}) => debug(message, { ...options, context }),
    info: (message: string, options: LogOptions = {}) => info(message, { ...options, context }),
    warn: (message: string, options: LogOptions = {}) => warn(message, { ...options, context }),
    error: (message: string, error?: any, options: LogOptions = {}) => error(message, error, { ...options, context }),
  };
}

/**
 * Logger instance with methods for different severity levels
 */
export const logger = {
  debug,
  info,
  warn,
  error,
  createContext: createContextLogger,
};

// Create specialized loggers for different areas of the application
export const dbLogger = logger.createContext('DB');
export const authLogger = logger.createContext('AUTH');
export const apiLogger = logger.createContext('API');

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
