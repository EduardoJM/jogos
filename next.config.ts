import type { NextConfig } from "next";

// No GitHub Pages o site fica em /<repo> (ex: /jogos). O workflow define PAGES_BASE_PATH;
// localmente fica vazio e o site roda na raiz.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // SSG: gera HTML estático em /out
  images: { unoptimized: true },
  basePath,
  trailingSlash: true, // gera /jogos/slug/index.html, que o GitHub Pages serve sem extensão
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
