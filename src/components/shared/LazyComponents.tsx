"use client";

import { lazy, Suspense, ComponentType, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Higher-order component for lazy loading with proper error boundary
function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: React.ComponentProps<T>) {
    const defaultFallback = (
      <div className="w-full h-64 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );

    return (
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Specific loading skeletons for different component types
export const PortfolioCardSkeleton = () => (
  <div className="space-y-4 p-4 border rounded-lg">
    <Skeleton className="h-48 w-full rounded" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const TeamCardSkeleton = () => (
  <div className="space-y-4 p-6 border rounded-lg">
    <Skeleton className="h-24 w-24 rounded-full mx-auto" />
    <div className="space-y-2 text-center">
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-3 w-24 mx-auto" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
);

export const DashboardChartSkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-64 w-full" />
    <div className="flex space-x-4">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

// Lazy-loaded components
export const LazyPortfolioGrid = withLazyLoading(
  () => import("@/components/portfolio/PortfolioGrid"),
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <PortfolioCardSkeleton key={i} />
    ))}
  </div>
);

export const LazyTeamSection = withLazyLoading(
  () => import("@/components/homepage/TeamSection"),
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <TeamCardSkeleton key={i} />
    ))}
  </div>
);

export const LazyDashboardStats = withLazyLoading(
  () => import("@/components/dashboard/DashboardStats"),
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
);

export const LazyPortfolioForm = withLazyLoading(
  () => import("@/components/forms/PortfolioForm"),
  <div className="space-y-6">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-12 w-32" />
  </div>
);

export const LazyServiceForm = withLazyLoading(
  () => import("@/components/forms/ServiceForm"),
  <div className="space-y-6">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-12 w-32" />
  </div>
);

export const LazyCustomerTable = withLazyLoading(
  () => import("@/components/crm/CustomerTable"),
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);

export const LazyChatWidget = withLazyLoading(
  () => import("@/components/chat/ChatWidget"),
  <div className="fixed bottom-4 right-4">
    <Skeleton className="h-14 w-14 rounded-full" />
  </div>
);

// Utility function for conditional lazy loading
export function LazyLoad({
  condition,
  children,
  fallback,
}: {
  condition: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (!condition) {
    return fallback || null;
  }

  return <>{children}</>;
}

// Performance monitoring for lazy components
export function withPerformanceTracking<T extends ComponentType<any>>(
  Component: T,
  componentName: string
) {
  return function PerformanceWrapper(props: React.ComponentProps<T>) {
    if (typeof window !== "undefined" && window.performance) {
      const startTime = performance.now();

      return (
        <Component
          {...props}
          onLoad={() => {
            const endTime = performance.now();
            const loadTime = endTime - startTime;

            if (process.env.NODE_ENV === "development" && loadTime > 100) {
              console.warn(`⚠️ ${componentName} took ${loadTime.toFixed(2)}ms to load`);
            }

            // Call original onLoad if provided
            if ("onLoad" in props && typeof props.onLoad === "function") {
              props.onLoad();
            }
          }}
        />
      );
    }

    return <Component {...props} />;
  };
}
