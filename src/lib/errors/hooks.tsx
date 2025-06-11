import { useState, useCallback } from "react";
import { errorMonitor, AppError, ErrorCode } from "./monitoring";

/**
 * Error state for use in React components
 */
export interface ErrorState {
  message: string;
  code?: ErrorCode;
  hasError: boolean;
}

const initialErrorState: ErrorState = {
  message: "",
  code: undefined,
  hasError: false,
};

/**
 * Hook for handling errors in React components with integration
 * to our error monitoring system
 */
export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>(initialErrorState);

  /**
   * Handle and capture an error
   */
  const handleError = useCallback((err: unknown, contextMessage?: string) => {
    let errorMessage = "An unexpected error occurred";
    let errorCode = ErrorCode.UNEXPECTED_ERROR;

    if (err instanceof AppError) {
      errorMessage = err.message;
      errorCode = err.code;
      // Let the monitoring system handle it
      errorMonitor.captureError(err);
    } else if (err instanceof Error) {
      errorMessage = contextMessage ? `${contextMessage}: ${err.message}` : err.message;
      // Track standard errors too
      errorMonitor.captureError(err);
    } else if (typeof err === "string") {
      errorMessage = err;
      // Create and track an error from the string
      errorMonitor.captureError(new Error(err));
    }

    setError({
      message: errorMessage,
      code: errorCode,
      hasError: true,
    });

    return { message: errorMessage, code: errorCode };
  }, []);

  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(initialErrorState);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}

/**
 * Wrap an async function with error handling
 */
export function useAsyncErrorHandler<T extends (...args: Parameters<T>) => Promise<ReturnType<T>>>(
  asyncFn: T,
  options?: {
    onError?: (error: Error) => void;
    context?: string;
  }
) {
  const { handleError } = useErrorHandler();

  return useCallback(
    async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>> | null> => {
      try {
        return await asyncFn(...args);
      } catch (error) {
        const context = options?.context ?? "Error executing operation";
        handleError(error, context);

        if (options?.onError && error instanceof Error) {
          options.onError(error);
        }

        return null;
      }
    },
    [asyncFn, handleError, options]
  );
}

/**
 * Higher-order component that adds error boundary functionality
 * to a React component using hooks
 */
export function withErrorHandling<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  fallback?: React.ComponentType<{ error: ErrorState; reset: () => void }>
): React.FC<T> {
  const WithErrorHandling: React.FC<T> = (props) => {
    const { error, handleError, clearError } = useErrorHandler();

    // Create error boundary effect - moved up before the conditional return
    useEffect(() => {
      const errorHandler = (event: ErrorEvent) => {
        handleError(event.error || event.message);
      };

      // Catch unhandled errors
      window.addEventListener("error", errorHandler);

      return () => {
        window.removeEventListener("error", errorHandler);
      };
    }, [handleError]);

    if (error.hasError && fallback) {
      const Fallback = fallback;
      return <Fallback error={error} reset={clearError} />;
    }

    return <Component {...props} />;
  };

  const displayName = Component.displayName || Component.name || "Component";
  WithErrorHandling.displayName = `withErrorHandling(${displayName})`;

  return WithErrorHandling;
}
