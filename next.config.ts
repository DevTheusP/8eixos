import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Cabeçalhos de segurança: ninguém embute o site num iframe (clickjacking), o navegador não "adivinha" tipos de arquivo,
  // o link de origem não vaza o endereço completo e o site não pede câmera, microfone ou localização.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
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
