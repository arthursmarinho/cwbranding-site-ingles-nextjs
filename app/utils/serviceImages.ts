const SERVICE_IMAGES: Record<number, string> = {
  1: "/fotos-servicos/SOCIAL MEDIA.webp",
  2: "/fotos-servicos/IDENTIDADE VISUAL.webp",
  3: "/fotos-servicos/TRÁFEGO.webp",
  4: "/fotos-servicos/LANDING PAGES.webp",
  5: "/fotos-servicos/ASSESSORIA.webp",
  6: "/fotos-servicos/ENSAIOS FOTOGRAFICOS.webp",
  7: "/fotos-servicos/MATERIAIS GRÁFICOS.webp",
  8: "/fotos-servicos/EVENTOS.webp",
  9: "/fotos-servicos/SEO.webp",
  10: "/fotos-servicos/SITES INSTITUCIONAIS.webp",
};

export function getServiceImageUrl(id: string | number): string {
  const path = SERVICE_IMAGES[Number(id)];
  if (!path) return "/cwbranding/servicos.png";
  return encodeURI(path);
}
