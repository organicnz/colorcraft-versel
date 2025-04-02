"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { 
  QueryClient, 
  QueryClientProvider 
} from "@tanstack/react-query";
import { useState } from "react";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            // Add default options for mutations
            retry: 0, // Don't retry mutations by default
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </SupabaseProvider>
      {/* Only show React Query Devtools in development - install with:
          npm install @tanstack/react-query-devtools --save-dev */}
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
}