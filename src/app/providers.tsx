"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useEffect } from "react";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    console.log('🔧 [PROVIDERS] Providers component mounted');
    console.log('🔧 [PROVIDERS] Document ready state:', document.readyState);
    console.log('🔧 [PROVIDERS] HTML classes:', document.documentElement.className);
    console.log('🔧 [PROVIDERS] Body classes:', document.body.className);
  }, []);

  return (
    <ReactQueryProvider>
      <SupabaseProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={true}
          storageKey="theme"
          enableColorScheme={true}
          forcedTheme={undefined}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </SupabaseProvider>
    </ReactQueryProvider>
  );
}