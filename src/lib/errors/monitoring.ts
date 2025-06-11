import { apiLogger } from "../logger";

/**
 * Error codes for consistent error handling
 */
export enum ErrorCode {
  // User-facing errors
  VALIDATION_FAILED = "validation_failed",
  RESOURCE_NOT_FOUND = "resource_not_found",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  RATE_LIMITED = "rate_limited",

  // System errors
  DATABASE_ERROR = "database_error",
  EXTERNAL_API_ERROR = "external_api_error",
  UNEXPECTED_ERROR = "unexpected_error",
  TIMEOUT = "timeout",
}

/**
 * Base error class for application
 */
export class AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  context?: Record<string, any>;
  isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.UNEXPECTED_ERROR,
    statusCode = 500,
    context?: Record<string, any>,
    isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    this.isOperational = isOperational; // True if error is expected/handled

    // Maintains proper stack trace
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.VALIDATION_FAILED, 400, context);
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.RESOURCE_NOT_FOUND, 404, context);
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", context?: Record<string, any>) {
    super(message, ErrorCode.UNAUTHORIZED, 401, context);
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", context?: Record<string, any>) {
    super(message, ErrorCode.FORBIDDEN, 403, context);
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded", context?: Record<string, any>) {
    super(message, ErrorCode.RATE_LIMITED, 429, context);
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.DATABASE_ERROR, 500, context, true);
  }
}

/**
 * External API error
 */
export class ExternalApiError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, ErrorCode.EXTERNAL_API_ERROR, 502, context, true);
  }
}

/**
 * Central error handler for reporting and monitoring errors
 */
export class ErrorMonitor {
  private static instance: ErrorMonitor;

  // Environment determines error handling behavior
  private readonly environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || "development";
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  /**
   * Log an error to the monitoring system
   */
  public captureError(error: Error, context?: Record<string, any>): void {
    const isAppError = error instanceof AppError;
    const errorCode = isAppError ? (error as AppError).code : ErrorCode.UNEXPECTED_ERROR;
    const errorContext = isAppError ? (error as AppError).context : context;

    // Log the error with context
    apiLogger.error(`Error: ${error.message}`, {
      metadata: {
        code: errorCode,
        stack: error.stack,
        ...errorContext,
      },
    });

    // In production, you would send to external monitoring service
    // Example: if (this.environment === 'production') { this.sendToExternalService(error); }
  }

  /**
   * Handle an error - determine whether to throw or gracefully degrade
   */
  public handleError(error: Error, shouldThrow = false): void {
    this.captureError(error);

    if (shouldThrow) {
      throw error;
    }
  }

  /**
   * Report an error without throwing
   */
  public reportError(error: Error): void {
    this.captureError(error);
  }

  /**
   * Create an error boundary component wrapper
   * Would be implemented in a frontend-specific file
   */
  // public createErrorBoundary() { ... }

  /**
   * Would send error to external monitoring service
   * This would be implemented when integrating with a service like Sentry
   */
  private sendToExternalService(error: Error): void {
    // Integration with external error monitoring service would go here
    // Example: Sentry.captureException(error);
  }
}

// Export a singleton instance
export const errorMonitor = ErrorMonitor.getInstance();
