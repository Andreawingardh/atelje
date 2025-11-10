import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-20ea7aa8a86f43f4be960730b132a87f.r2.dev',
      },
    ],
  },
};

export default nextConfig;
