import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Imagens que passam pelo otimizador: o card gerado na hora (com os parâmetros do resultado) e os exemplos fixos.
  images: {
    localPatterns: [{ pathname: "/api/card" }, { pathname: "/exemplos/**" }],
  },
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
