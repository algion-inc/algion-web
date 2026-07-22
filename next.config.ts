import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: false
  },
  productionBrowserSourceMaps: false,
  compress: false
};

export default nextConfig;
