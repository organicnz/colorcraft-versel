import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * A utility hook for handling optimistic updates with React Query
 * @param queryKey The query key to invalidate after mutation
 * @param mutationFn The function that performs the mutation
 * @param options Additional options for optimistic updates
 */
export function useOptimisticMutation<TData, TError, TVariables, TContext>(
  queryKey: string[],
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onMutate?: (variables: TVariables) => Promise<TContext> | TContext;
    onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void | Promise<unknown>;
    onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void | Promise<unknown>;
  }
) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);
      
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
      // Apply the custom onError function if provided
      if (options?.onError) {
        return options.onError(error as TError, variables, context);
      }
    },
  });
}
