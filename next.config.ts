import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce build cache to save memory
  compress: true,
  // Disable source maps in dev to save memory
  productionBrowserSourceMaps: false,
  // Turbopack optimizations for faster compilation
  turbopack: {},
  // Reduce recompilation on changes
  onDemandEntries: {
    // Keep pages in memory for 60 seconds
    maxInactiveAge: 60 * 1000,
    // Keep at most 5 pages in memory
    pagesBufferLength: 5,
  },
};

export default nextConfig;
