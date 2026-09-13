import type { NextConfig } from "next";

const devOrigin = process.env.DEV_ORIGIN?.trim();

const nextConfig: NextConfig = {
  ...(devOrigin ? { allowedDevOrigins: [devOrigin] } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    // Allowed image quality levels (75 default, 90 for screenshots/UI)
    qualities: [75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
