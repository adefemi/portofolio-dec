import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  // the Gate Runner prototype was folded into the full game
  async redirects() {
    return [{ source: "/games/gate-runner", destination: "/games/zombie-rush", permanent: true }];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
