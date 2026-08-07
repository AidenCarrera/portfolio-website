import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN IP access for local network device testing in dev
  allowedDevOrigins: ["192.168.0.32"],
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
    // Format optimization hierarchy (AVIF preferred, WebP fallback)
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
