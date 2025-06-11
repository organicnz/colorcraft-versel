import dynamic from 'next/dynamic';
import { ComponentType, Suspense } from 'react';

// Loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
  </div>
);

const LoadingCard = () => (
  <div className="rounded-lg border bg-card p-4 animate-pulse">
    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-muted rounded w-1/2"></div>
  </div>
);

const LoadingButton = () => (
  <div className="h-10 bg-muted rounded animate-pulse w-24"></div>
);

// Create a higher-order component for lazy loading with error boundaries
function withLazyLoading<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback: ComponentType = LoadingSpinner
) {
  const LazyComponent = dynamic(importFn, {
    loading: fallback,
    ssr: true, // Enable SSR for better SEO
  });

  return function LazyWrapper(props: T) {
    return (
      <Suspense fallback={<fallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Portfolio Components (heavy components that should be lazy loaded)
export const LazyPortfolioGrid = withLazyLoading(
  () => import('@/components/portfolio/PortfolioGrid'),
  LoadingCard
);

export const LazyImageUpload = withLazyLoading(
  () => import('@/components/ui/image-upload'),
  LoadingCard
);

// Dashboard Components (admin-only, should be lazy loaded)
export const LazyDashboardCharts = withLazyLoading(
  () => import('@/components/dashboard/Charts').catch(() => ({ default: () => <div>Charts not available</div> })),
  LoadingCard
);

export const LazyCustomerTable = withLazyLoading(
  () => import('@/components/crm/CustomerTable').catch(() => ({ default: () => <div>Customer table not available</div> })),
  LoadingCard
);

// Forms (can be heavy due to validation libraries)
export const LazyContactForm = withLazyLoading(
  () => import('@/components/forms/ContactForm'),
  () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-20 bg-muted rounded"></div>
      <LoadingButton />
    </div>
  )
);

export const LazyQuoteForm = withLazyLoading(
  () => import('@/components/forms/QuoteForm'),
  () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-10 bg-muted rounded"></div>
      <div className="h-20 bg-muted rounded"></div>
      <LoadingButton />
    </div>
  )
);

// Chat Widget (heavy component with real-time features)
export const LazyChatWidget = withLazyLoading(
  () => import('@/components/chat/ChatWidget'),
  () => (
    <div className="fixed bottom-4 right-4 w-12 h-12 bg-muted rounded-full animate-pulse"></div>
  )
);

// Map components (typically heavy)
export const LazyMapComponent = withLazyLoading(
  () => import('@/components/ui/Map').catch(() => ({ default: () => <div>Map not available</div> })),
  () => (
    <div className="w-full h-64 bg-muted rounded animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground">Loading map...</span>
    </div>
  )
);

// Rich text editor (heavy component)
export const LazyRichTextEditor = withLazyLoading(
  () => import('@/components/ui/RichTextEditor').catch(() => ({ default: () => <textarea className="w-full h-32 p-2 border rounded" /> })),
  () => (
    <div className="w-full h-32 bg-muted rounded animate-pulse"></div>
  )
);

// Code syntax highlighter (heavy component)
export const LazyCodeHighlighter = withLazyLoading(
  () => import('@/components/ui/CodeHighlighter').catch(() => ({ default: ({ children }: { children: string }) => <pre>{children}</pre> })),
  () => (
    <div className="w-full h-20 bg-muted rounded animate-pulse"></div>
  )
);

// Export the HOC for custom use
export { withLazyLoading }; 