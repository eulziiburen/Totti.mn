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
  async redirects() {
    return [
      // Short link for School 52's sponsorship book, hosted as a shared Claude artifact.
      // Not permanent, so the target can change without browsers caching the old one.
      { source: "/sponsor", destination: "https://claude.ai/artifact/DuKWawLScUrgrx5XBnMzLD", permanent: false },
    ];
  },
  async rewrites() {
    return [
      // Static flipbook of School 52's basketball team, served from /public.
      { source: "/52_r_surguuli", destination: "/52_r_surguuli/index.html" },
    ];
  },
};

export default nextConfig;
