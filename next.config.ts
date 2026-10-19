import type { NextConfig } from "next";

/** Old Portuguese service slugs → English slugs (301). */
const SERVICE_SLUG_REDIRECTS: [string, string][] = [
  ["identidade-visual", "visual-identity"],
  ["gestao-de-trafego", "paid-traffic"],
  ["agencia-de-branding", "branding-agency"],
  ["ensaios-fotograficos", "brand-photography"],
  ["materiais-graficos", "graphic-design"],
  ["cobertura-de-eventos", "event-coverage"],
  ["sites-institucionais", "e-commerce"],
];

const nextConfig: NextConfig = {
  transpilePackages: ["firebase-admin"],
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },
  async redirects() {
    const slugRedirects = SERVICE_SLUG_REDIRECTS.map(([source, destination]) => ({
      source: `/servicos/${source}`,
      destination: `/services/${destination}`,
      permanent: true,
    }));

    return [
      ...slugRedirects,
      {
        source: "/servicos/:slug",
        destination: "/services/:slug",
        permanent: true,
      },
      { source: "/servicos", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
