import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // As rotas de imagem leem fontes e retratos do disco: garante que esses arquivos vão junto pro servidor.
  outputFileTracingIncludes: {
    "/api/card": ["./assets/fonts/**", "./public/retratos/jpg/**"],
    "/api/og": ["./assets/fonts/**"],
    "/api/comparar-card": ["./assets/fonts/**"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
