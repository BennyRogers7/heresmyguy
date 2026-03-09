import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "output: export" to enable ISR (Incremental Static Regeneration)
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  // Redirect old MN-only city URLs to new state/city structure
  async redirects() {
    return [
      // Common MN cities - redirect old /city to /minnesota/city
      {
        source: "/minneapolis",
        destination: "/minnesota/minneapolis",
        permanent: true,
      },
      {
        source: "/minneapolis/:service",
        destination: "/minnesota/minneapolis/plumbers",
        permanent: true,
      },
      {
        source: "/st-paul",
        destination: "/minnesota/st-paul",
        permanent: true,
      },
      {
        source: "/st-paul/:service",
        destination: "/minnesota/st-paul/plumbers",
        permanent: true,
      },
      {
        source: "/duluth",
        destination: "/minnesota/duluth",
        permanent: true,
      },
      {
        source: "/duluth/:service",
        destination: "/minnesota/duluth/plumbers",
        permanent: true,
      },
      {
        source: "/rochester",
        destination: "/minnesota/rochester",
        permanent: true,
      },
      {
        source: "/rochester/:service",
        destination: "/minnesota/rochester/plumbers",
        permanent: true,
      },
      {
        source: "/bloomington",
        destination: "/minnesota/bloomington",
        permanent: true,
      },
      {
        source: "/bloomington/:service",
        destination: "/minnesota/bloomington/plumbers",
        permanent: true,
      },
      // Old service pages
      {
        source: "/services/:service",
        destination: "/trade/plumbers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
