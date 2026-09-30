import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    return [
      // Static flipbook of School 52's basketball team, served from /public.
      { source: "/52_r_surguuli", destination: "/52_r_surguuli/index.html" },
    ];
  },
};

export default nextConfig;
