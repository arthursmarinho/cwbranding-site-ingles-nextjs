// Leitura dos posts do blog no Firestore — SOMENTE servidor.
import "server-only";
import { cache } from "react";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { emptyText, type Post, type PostText } from "@/app/blog/types";

export const POSTS_COLLECTION = "posts";

function toText(value: unknown): PostText {
  const v = (value ?? {}) as Partial<PostText>;
  return {
    title: v.title ?? emptyText.title,
    excerpt: v.excerpt ?? emptyText.excerpt,
    content: v.content ?? emptyText.content,
  };
}

function toPost(doc: DocumentSnapshot): Post {
  const d = doc.data() ?? {};
  return {
    slug: doc.id,
    coverUrl: d.coverUrl ?? "",
    published: d.published === true,
    archived: d.archived === true,
    createdAt: d.createdAt?.toDate().toISOString() ?? null,
    pt: toText(d.pt),
    en: toText(d.en),
  };
}

// Todos os posts, inclusive rascunhos (usado no painel), do mais novo para o mais antigo.
export async function getAllPosts(): Promise<Post[]> {
  const snap = await adminDb().collection(POSTS_COLLECTION).orderBy("createdAt", "desc").get();
  return snap.docs.map(toPost);
}

// O post aparece no site se estiver publicado e não estiver arquivado.
function isVisible(post: Post) {
  return post.published && !post.archived;
}

// Só os visíveis (usado no site). Se o Firebase falhar, o site continua no ar sem o blog.
export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const posts = await getAllPosts();
    return posts.filter(isVisible);
  } catch (error) {
    console.error("[blog] falha ao carregar posts:", error);
    return [];
  }
}

// cache(): o título da aba (generateMetadata) e o conteúdo da página
// usam a mesma consulta, em vez de ir ao Firebase duas vezes.
export const getPublishedPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const doc = await adminDb().collection(POSTS_COLLECTION).doc(slug).get();
    if (!doc.exists) return null;
    const post = toPost(doc);
    return isVisible(post) ? post : null;
  } catch (error) {
    console.error("[blog] falha ao carregar post:", error);
    return null;
  }
});
