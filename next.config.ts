import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: false
  },
  swcMinify: false,
  productionBrowserSourceMaps: false,
  compress: false
};

export default nextConfig;
