import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.darkglance.in",
      },
    ],
  },
};
export default nextConfig;
