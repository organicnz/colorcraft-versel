"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type QueryOptions<T> = {
  enabled?: boolean;
  staleTime?: number;
  retry?: boolean | number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

/**
 * Custom hook for fetching data from Supabase with optimized caching via React Query
 * 
 * @param key - The query key for React Query (for caching and refetching)
 * @param queryFn - Function that returns a Supabase query
 * @param options - Additional React Query options
 * @returns Query result with data, loading state, and error information
 */
export function useSupabaseQuery<T>(
  key: string | string[],
  queryFn: () => Promise<T>,
  options: QueryOptions<T> = {}
) {
  // Create a stable query key array
  const queryKey = Array.isArray(key) ? key : [key];
  
  // Handle browser vs server
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        console.error(`Error fetching data for ${queryKey.join('/')}:`, error);
        throw error;
      }
    },
    enabled: isMounted && (options.enabled !== false), // Only run query on client side
    staleTime: options.staleTime || 1000 * 60, // 1 minute by default
    retry: options.retry,
    retryDelay: options.retryDelay,
    onSuccess: options.onSuccess,
    onError: (error) => {
      // Default error handling
      if (options.onError) {
        options.onError(error as Error);
      } else {
        toast.error("Failed to load data");
      }
    },
  });
}

/**
 * Helper hook for querying a Supabase table with filters
 */
export function useSupabaseTable<T>(
  tableName: string,
  query: {
    select?: string;
    eq?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    range?: [number, number];
  },
  options: QueryOptions<T> = {}
) {
  const queryKey = [
    tableName,
    query.select || "*",
    ...Object.entries(query.eq || {}).flat(),
    query.order?.column,
    query.order?.ascending,
    query.limit,
    query.range?.join("-"),
  ].filter(Boolean);

  return useSupabaseQuery<T>(
    queryKey,
    async () => {
      const supabase = createClient();
      
      let supabaseQuery = supabase
        .from(tableName)
        .select(query.select || "*");
      
      // Apply filters
      if (query.eq) {
        Object.entries(query.eq).forEach(([column, value]) => {
          supabaseQuery = supabaseQuery.eq(column, value);
        });
      }
      
      // Apply ordering
      if (query.order) {
        supabaseQuery = supabaseQuery.order(
          query.order.column,
          { ascending: query.order.ascending ?? true }
        );
      }
      
      // Apply limits
      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      }
      
      // Apply range
      if (query.range) {
        supabaseQuery = supabaseQuery.range(query.range[0], query.range[1]);
      }
      
      const { data, error } = await supabaseQuery;
      
      if (error) {
        throw error;
      }
      
      return data as T;
    },
    options
  );
} 