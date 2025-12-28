import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for development to reduce memory usage
  experimental: {
    // Disable source maps in development to save memory
    // Can re-enable if needed for debugging
  },
  // Reduce build cache to save memory
  compress: true,
};

export default nextConfig;
