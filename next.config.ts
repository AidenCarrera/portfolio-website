import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/developer-favicon.svg",
      },
    ];
  },
};

export default nextConfig;
