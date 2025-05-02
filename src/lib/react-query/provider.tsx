"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
// Don't import ReactQueryDevtools directly
// Instead use dynamic import

export function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Create a client for each user session to avoid data leakage between sessions
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optimize for user experience
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on focus by default
        retry: 1, // Retry failed queries once
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only include React Query Devtools in development */}
      {process.env.NODE_ENV === 'development' &&
        // Import dynamically to avoid including in production bundle
        typeof window !== 'undefined' &&
        (() => {
          try {
            // This will be caught if the module doesn't exist
            // which is expected in production builds
            const { ReactQueryDevtools } = require('@tanstack/react-query-devtools');
            return <ReactQueryDevtools initialIsOpen={false} />;
          } catch (e) {
            return null;
          }
        })()
      }
    </QueryClientProvider>
  );
} 