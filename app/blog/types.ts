// Formato de um post do blog. Usado no servidor (Firestore) e no navegador.
import type { Language } from "../utils/translations";

// Texto do post em um idioma.
export type PostText = {
  title: string;
  excerpt: string; // resumo curto, aparece nos cards
  content: string; // texto completo, em Markdown
};

export type Post = {
  slug: string; // endereço do post: /blog/<slug>
  coverUrl: string; // imagem de capa (ImageKit)
  published: boolean; // false = rascunho, não aparece no site
  archived: boolean; // true = arquivado: sai do site e da lista principal do painel
  createdAt: string | null; // data em ISO
  pt: PostText;
  en: PostText;
};

export const emptyText: PostText = { title: "", excerpt: "", content: "" };

// Texto no idioma escolhido. Se a versão em inglês não foi escrita, usa a em português.
export function getPostText(post: Post, language: Language): PostText {
  if (language === "EN" && post.en.title) return post.en;
  return post.pt;
}

// Tempo de leitura estimado (200 palavras por minuto, mínimo 1).
export function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// "Meu Primeiro Post!" -> "meu-primeiro-post"
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatPostDate(iso: string | null, language: Language) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}
