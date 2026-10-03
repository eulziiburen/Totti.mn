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
      // /sponsor used to serve School 52's book directly; keep old links working.
      // Not permanent, so /sponsor can become its own page later.
      { source: "/sponsor", destination: "/sponsor/52-r-surguuli", permanent: false },
    ];
  },
  async rewrites() {
    return [
      // School 52's sponsorship book: a static copy of the Claude artifact
      // (https://claude.ai/artifact/DuKWawLScUrgrx5XBnMzLD) served from /public.
      // Edits to the artifact don't flow here automatically; re-export public/sponsor/52-r-surguuli/index.html after changing it.
      { source: "/sponsor/52-r-surguuli", destination: "/sponsor/52-r-surguuli/index.html" },
    ];
  },
};

export default nextConfig;
