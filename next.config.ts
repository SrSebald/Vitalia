import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages compatibility
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Enable experimental features for Cloudflare compatibility
  experimental: {
    // Required for Cloudflare Workers compatibility
    serverMinification: true,
  },
  // Image optimization configuration for Cloudflare
  images: {
    unoptimized: true, // Cloudflare has its own image optimization
  },
  // Output configuration
  output: 'standalone',
};

export default nextConfig;
