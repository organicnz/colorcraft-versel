import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

/**
 * A utility hook for handling optimistic updates with React Query
 * @param queryKey The query key to invalidate after mutation
 * @param mutationFn The function that performs the mutation
 * @param options Additional options for optimistic updates
 */
export function useOptimisticMutation<TData, TError, TVariables, TContext = unknown>(
  queryKey: string[],
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
    onSuccess?: (
      data: TData,
      variables: TVariables,
      context: TContext | undefined
    ) => void | Promise<unknown>;
    onError?: (
      error: TError,
      variables: TVariables,
      context: TContext | undefined
    ) => void | Promise<unknown>;
    optimisticUpdater?: (variables: TVariables, queryData: unknown) => unknown;
    rollbackOnError?: boolean;
  }
) {
  const queryClient = useQueryClient();
  const rollbackEnabled = options?.rollbackOnError ?? true;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any pending operations on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      // Create a new AbortController for this mutation
      abortControllerRef.current = new AbortController();
      try {
        return await mutationFn(variables);
      } catch (error) {
        // Check if this error is due to our own abort
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error("Mutation aborted");
        }
        throw error;
      }
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value with proper typing
      const previousData = queryClient.getQueryData<unknown>(queryKey);

      // Apply optimistic update if provided
      if (options?.optimisticUpdater && previousData !== undefined) {
        queryClient.setQueryData(queryKey, options.optimisticUpdater(variables, previousData));
      }

      // Apply the custom onMutate function if provided
      const context = options?.onMutate ? await options.onMutate(variables) : undefined;

      return { previousData, ...context } as TContext;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate the query to refetch the latest data
      queryClient.invalidateQueries({ queryKey });

      // Apply the custom onSuccess function if provided
      if (options?.onSuccess) {
        return options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Rollback to previous data if rollback is enabled
      if (rollbackEnabled && context && "previousData" in context) {
        queryClient.setQueryData(queryKey, (context as { previousData: unknown }).previousData);
      }

      // Apply the custom onError function if provided
      if (options?.onError) {
        return options.onError(error, variables, context);
      }
    },
  });
}

/**
 * Type-safe optimistic mutation response handler
 * @param response The response from a server action
 * @param handlers Object containing success and error handlers
 */
export function handleMutationResponse<T>(
  response: { success: boolean; data?: T; error?: string; code?: string },
  handlers: {
    onSuccess?: (data: T) => void;
    onError?: (error: string, code?: string) => void;
  }
) {
  if (response.success && response.data && handlers.onSuccess) {
    handlers.onSuccess(response.data);
  } else if (!response.success && handlers.onError) {
    handlers.onError(response.error || "Something went wrong", response.code);
  }
}
