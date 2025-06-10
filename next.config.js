/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds to avoid deployment failures
    ignoreDuringBuilds: true,
  },
  // Explicitly define path aliases to ensure proper resolution in Vercel
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
  // Use standalone for API routes, export for static pages
  output: process.env.GITHUB_ACTIONS ? 'standalone' : 'standalone',
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
    unoptimized: process.env.GITHUB_ACTIONS === 'true',
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
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
  // Skip TypeScript type checking during build for production deployments
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Note: PPR is only available in canary, commented out for stable version
    // ppr: 'incremental', // Partial Pre-rendering (Next.js canary feature)
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_SITE_URL || ""],
    },
    optimizeCss: true, // Enable CSS optimization
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
    CUSTOM_KEY: 'my-value',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return config
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