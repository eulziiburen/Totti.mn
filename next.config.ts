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
      // UFE's book is temporarily hidden: send its URLs home. Remove these two (and restore the
      // rewrite below and the menu item in src/lib/data.ts) to bring it back.
      { source: "/sponsor/sezis", destination: "/", permanent: false },
      { source: "/sponsor/sezis/index.html", destination: "/", permanent: false },
    ];
  },
  async rewrites() {
    return [
      // School 52's sponsorship book: a static copy of the Claude artifact
      // (https://claude.ai/artifact/DuKWawLScUrgrx5XBnMzLD) served from /public.
      // Edits to the artifact don't flow here automatically; re-export public/sponsor/52-r-surguuli/index.html after changing it.
      { source: "/sponsor/52-r-surguuli", destination: "/sponsor/52-r-surguuli/index.html" },
      // UFE's book: a full-page embed of its FlipHTML5 book, so the URL stays totti.mn/sponsor/sezis.
      // { source: "/sponsor/sezis", destination: "/sponsor/sezis/index.html" },
      // Totti CRM: static app behind the CRM login (see src/proxy.ts); data via /api/crm.
      { source: "/crm", destination: "/crm/app.html" },
    ];
  },
};

export default nextConfig;
