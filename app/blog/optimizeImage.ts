// Pede ao ImageKit uma versão menor da imagem, já no formato mais leve (WebP/AVIF).
// A imagem original continua guardada; só o link muda.
// Ex.: optimizeImage(url, 800) -> ...foto.jpg?tr=w-800,q-80
// Documentação: https://imagekit.io/docs/image-transformation

// Larguras usadas no site. Ficam aqui para o "aquecimento" (ver blog-actions.ts)
// pedir exatamente as mesmas versões que as páginas usam.
export const IMAGE_WIDTHS = {
  thumb: 200, // miniatura na lista do painel
  card: 800, // card na home e em /blog
  cover: 1080, // capa na página do post (1080x1350)
  content: 1400, // imagens no meio do texto
  share: 1200, // compartilhamento (WhatsApp, LinkedIn), em JPG
};

export function optimizeImage(url: string, width: number, format?: "jpg") {
  // Imagens que não são do ImageKit ficam como estão.
  if (!url.includes("ik.imagekit.io")) return url;

  const transform = `w-${width},q-80${format ? `,f-${format}` : ""}`;
  // Os links do ImageKit podem já ter "?updatedAt=...", então usamos & nesse caso.
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}tr=${transform}`;
}
