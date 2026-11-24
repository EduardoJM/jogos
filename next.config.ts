import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // SSG: gera HTML estático em /out
  images: { unoptimized: true },
};

export default nextConfig;
