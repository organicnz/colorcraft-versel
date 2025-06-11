"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

// Dynamically import React Query Devtools to avoid including in production bundle
const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools
    })),
  { ssr: false }
);

// Create a singleton QueryClient to avoid recreating on every render
let globalQueryClient: QueryClient | undefined = undefined;

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Optimize for performance and user experience
        staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch on focus by default
        refetchOnReconnect: "always", // Refetch when reconnecting to internet
        retry: (failureCount, error: any) => {
          // Smart retry logic
          if (error?.status === 404 || error?.status === 403) {
            return false; // Don't retry for these errors
          }
          return failureCount < 3; // Retry up to 3 times for other errors
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        // Enable background refetching for better UX
        refetchOnMount: "always",
        // Optimize for mobile users
        networkMode: "offlineFirst",
      },
      mutations: {
        // Optimize mutations
        retry: 1,
        retryDelay: 1000,
        networkMode: "offlineFirst",
        // Global mutation error handling
        onError: (error: any) => {
          if (process.env.NODE_ENV === "development") {
            console.error("Mutation error:", error);
          }
          // You can add global error handling here (toast, error tracking, etc.)
        },
      },
    },
  });
};

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // Use singleton pattern to avoid recreating client on every render
  const [queryClient] = useState(() => {
    if (typeof window === "undefined") {
      // Server-side: create a new client for each request
      return createQueryClient();
    }

    // Client-side: use singleton pattern
    if (!globalQueryClient) {
      globalQueryClient = createQueryClient();
    }
    return globalQueryClient;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only include React Query Devtools in development */}
      {/* Temporarily disabled: {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}

// Export the query client for use in server components and other places
export { createQueryClient };
