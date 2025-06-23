"use client";

import { ReactNode } from "react";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <SupabaseProvider>
        {children}
        <Toaster />
      </SupabaseProvider>
    </ReactQueryProvider>
  );
}
