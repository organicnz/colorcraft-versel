"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        {children}
        <Toaster />
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
