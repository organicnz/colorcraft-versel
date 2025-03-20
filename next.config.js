/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "tydgehnkaszuvcaywwdm.supabase.co", // Supabase storage domain
      "uploadthing.com", // UploadThing domain for image uploads
    ],
    formats: ["image/webp"],
  },
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
  experimental: {
    serverActions: {
      allowedOrigins: [process.env.NEXT_PUBLIC_SITE_URL || ""],
    },
  },
};

module.exports = nextConfig; 