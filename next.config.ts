import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Only bundle the icons/chart pieces actually imported instead of the whole
  // library barrel file — cuts client JS size (and therefore parse/hydrate
  // time) meaningfully since lucide-react and recharts are used on nearly
  // every page.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
