// Mostra o texto do post (escrito em Markdown) como HTML.
// O react-markdown não executa HTML nem scripts colados no texto, então é seguro.
// O visual (títulos, listas, links...) está em .post-content no globals.css.
import Markdown from "react-markdown";
import { IMAGE_WIDTHS, optimizeImage } from "./optimizeImage";

export function PostContent({ content }: { content: string }) {
  return (
    <div className="post-content">
      <Markdown
        components={{
          // Imagens do texto: versão reduzida pelo ImageKit e carregamento só quando aparecem na tela.
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={optimizeImage(String(src ?? ""), IMAGE_WIDTHS.content)} alt={alt ?? ""} loading="lazy" />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
