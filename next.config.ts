import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        // Image assets all live under /images; files (audio, resume) are
        // served directly and never go through the image optimizer.
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
