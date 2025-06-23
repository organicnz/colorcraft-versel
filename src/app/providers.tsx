"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <SupabaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
          storageKey="theme"
          enableColorScheme={true}
          themes={["light", "dark", "system"]}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </SupabaseProvider>
    </ReactQueryProvider>
  );
}
