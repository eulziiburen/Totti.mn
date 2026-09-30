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
      // School 52's sponsorship book: a static copy of the Claude artifact
      // (https://claude.ai/artifact/DuKWawLScUrgrx5XBnMzLD) served from /public, so the URL stays totti.mn/sponsor.
      // Edits to the artifact don't flow here automatically; re-export public/sponsor/index.html after changing it.
      { source: "/sponsor", destination: "/sponsor/index.html" },
    ];
  },
};

export default nextConfig;
