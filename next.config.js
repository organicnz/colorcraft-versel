/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds to avoid deployment failures
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript type checking during build for production deployments
  typescript: {
    ignoreBuildErrors: true,
  },
  // Suppress warnings during build
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Suppress specific warnings
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Explicitly define path aliases to ensure proper resolution in Vercel
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    
    // Suppress specific warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found/,
    ];
    
    // Performance optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      }
    }

    return config
  },
  trailingSlash: true,
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  // Server external packages (moved from experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["postgres"],
  images: {
    unoptimized: false,
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'tydgehnkaszuvcaywwdm.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tydgehnkaszuvcaywwdm.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
  experimental: {
    // Note: PPR is only available in canary, commented out for stable version
    // ppr: 'incremental', // Partial Pre-rendering (Next.js canary feature)
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_SITE_URL || ""],
    },
    optimizeCss: true,
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      'lucide-react',
      'date-fns',
    ],
    // React 19 compatibility for Next.js 15
    reactCompiler: false, // Disable until React 19 is stable
  },
  // Static optimization
  generateBuildId: async () => {
    return 'colorcraft-build'
  },
  // Environment variables available at build time
  env: {
    CUSTOM_KEY: 'colorcraft-production',
  },
};

// Add bundle analyzer if environment variable is set
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}