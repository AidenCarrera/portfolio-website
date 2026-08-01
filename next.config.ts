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
    // Next 16 rejects any `quality` not listed here with a 400, so every value
    // used by a component has to be declared. 75 is the framework default;
    // 90 is what project screenshots use — UI text and thin borders are exactly
    // what a lossy encoder smears at 75.
    qualities: [75, 90],
    // AVIF first, WebP as the fallback for browsers that do not send it in
    // Accept. AVIF holds fine detail at a given file size noticeably better
    // than WebP; the cost is slower first-time encodes, which the optimizer
    // cache absorbs after the first request per size.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
