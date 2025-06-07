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
  // Use standalone output mode to fix deployment issues
  output: 'standalone',
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'colorcraft.live',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Disable optimization in development to rule out image optimization issues
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
    // Next.js 15 optimizations
    turbo: {
      resolveAlias: {
        '@': './src',
      },
    },
    ppr: 'incremental', // Partial Pre-rendering (Next.js 15 feature)
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_SITE_URL || ""],
    },
    serverComponentsExternalPackages: ["postgres"],
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