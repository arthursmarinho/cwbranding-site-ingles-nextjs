"use server";

// Ações do blog no painel. Todas conferem a sessão do admin antes de fazer qualquer coisa.
import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAdminSession } from "@/lib/admin-session";
import { adminDb } from "@/lib/firebase-admin";
import { POSTS_COLLECTION } from "@/lib/posts";
import { IMAGE_WIDTHS, optimizeImage } from "../blog/optimizeImage";
import type { PostText } from "../blog/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type PostInput = {
  slug: string;
  coverUrl: string;
  published: boolean;
  pt: PostText;
  en: PostText;
};

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Atualiza o site inteiro (home, /blog, posts e sitemap) para mostrar a mudança na hora.
function refreshSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

export async function savePost(input: PostInput, isNew: boolean): Promise<ActionResult> {
  if (!(await verifyAdminSession())) return { ok: false, error: "Sessão expirada. Entre de novo." };

  if (!SLUG_PATTERN.test(input.slug)) {
    return { ok: false, error: "Endereço inválido. Use só letras minúsculas, números e hífens." };
  }
  if (!input.pt.title.trim() || !input.pt.content.trim()) {
    return { ok: false, error: "Preencha pelo menos o título e o texto em português." };
  }

  const ref = adminDb().collection(POSTS_COLLECTION).doc(input.slug);

  try {
    if (isNew && (await ref.get()).exists) {
      return { ok: false, error: "Já existe um post com esse endereço." };
    }

    await ref.set(
      {
        coverUrl: input.coverUrl,
        published: input.published,
        pt: input.pt,
        en: input.en,
        updatedAt: FieldValue.serverTimestamp(),
        // A data de criação só é gravada uma vez.
        ...(isNew && { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("[blog] falha ao salvar post:", error);
    return { ok: false, error: "Não foi possível salvar. Tente novamente." };
  }

  refreshSite();
  await warmImages(input);
  return { ok: true };
}

// Na primeira vez que um tamanho de imagem é pedido, o ImageKit leva ~0,7s para gerá-lo.
// Pedimos todas as versões usadas no site logo ao salvar, para o visitante já recebê-las prontas.
async function warmImages(input: PostInput) {
  // Imagens no meio do texto: ![descrição](link)
  const contentImages = [input.pt.content, input.en.content]
    .flatMap((text) => [...text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1]));

  const urls = [
    ...(input.coverUrl
      ? [
          optimizeImage(input.coverUrl, IMAGE_WIDTHS.thumb),
          optimizeImage(input.coverUrl, IMAGE_WIDTHS.card),
          optimizeImage(input.coverUrl, IMAGE_WIDTHS.cover),
          optimizeImage(input.coverUrl, IMAGE_WIDTHS.share, "jpg"),
        ]
      : []),
    ...contentImages.map((url) => optimizeImage(url, IMAGE_WIDTHS.content)),
  ];

  // Mesmo cabeçalho dos navegadores, para o ImageKit gerar a versão WebP/AVIF que eles recebem.
  const headers = { Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8" };
  // allSettled: se alguma imagem falhar, o post continua salvo normalmente.
  await Promise.allSettled(urls.map((url) => fetch(url, { headers })));
}

// Arquiva (archived = true) ou desarquiva (archived = false) um post. Nada é apagado.
export async function setPostArchived(slug: string, archived: boolean): Promise<ActionResult> {
  if (!(await verifyAdminSession())) return { ok: false, error: "Sessão expirada. Entre de novo." };

  try {
    await adminDb()
      .collection(POSTS_COLLECTION)
      .doc(slug)
      .update({ archived, updatedAt: FieldValue.serverTimestamp() });
  } catch (error) {
    console.error("[blog] falha ao arquivar post:", error);
    return { ok: false, error: "Não foi possível arquivar. Tente novamente." };
  }

  refreshSite();
  return { ok: true };
}

export async function deletePost(slug: string): Promise<ActionResult> {
  if (!(await verifyAdminSession())) return { ok: false, error: "Sessão expirada. Entre de novo." };

  try {
    await adminDb().collection(POSTS_COLLECTION).doc(slug).delete();
  } catch (error) {
    console.error("[blog] falha ao apagar post:", error);
    return { ok: false, error: "Não foi possível apagar. Tente novamente." };
  }

  refreshSite();
  return { ok: true };
}

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

// Envia uma imagem para o ImageKit (pasta /blog) e devolve o link dela.
// Documentação: https://imagekit.io/docs/api-reference/upload-file/upload-file
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  if (!(await verifyAdminSession())) return { ok: false, error: "Sessão expirada. Entre de novo." };

  const file = formData.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return { ok: false, error: "Escolha um arquivo de imagem." };
  }

  const body = new FormData();
  body.append("file", file);
  body.append("fileName", file.name);
  body.append("folder", "/blog");

  // O ImageKit usa a chave privada como usuário, com senha vazia.
  const credentials = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString("base64");

  try {
    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
      body,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return { ok: true, url: data.url };
  } catch (error) {
    console.error("[blog] falha no envio para o ImageKit:", error);
    return { ok: false, error: "Não foi possível enviar a imagem." };
  }
}
