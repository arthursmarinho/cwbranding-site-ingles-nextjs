import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin vem como pacote "externo" por padrão no Next. Empacotado,
  // o require() de dependências só-ESM (jose, usado por firebase-admin/auth)
  // é resolvido no build e funciona em qualquer versão do Node da Vercel.
  transpilePackages: ["firebase-admin"],
  images: {
    unoptimized: true,
  },
  experimental: {
    // Envio de imagens do blog pelo painel (padrão é 1MB). A Vercel aceita até 4.5MB.
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
