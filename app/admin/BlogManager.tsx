"use client";

import { useState, useTransition } from "react";
import { Archive, ArchiveRestore, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { IMAGE_WIDTHS, optimizeImage } from "../blog/optimizeImage";
import { emptyText, formatPostDate, type Post } from "../blog/types";
import { deletePost, setPostArchived } from "./blog-actions";
import { PostEditor } from "./PostEditor";

const newPost: Post = {
  slug: "",
  coverUrl: "",
  published: false,
  archived: false,
  createdAt: null,
  pt: emptyText,
  en: emptyText,
};

type View = "active" | "archived";

const smallButton =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/80";

// Aba "Blog" do painel: lista de posts (ativos ou arquivados). Ao criar ou editar, abre o PostEditor.
export function BlogManager({ posts }: { posts: Post[] }) {
  const [editing, setEditing] = useState<{ post: Post; isNew: boolean } | null>(null);
  const [view, setView] = useState<View>("active");
  const [pending, startTransition] = useTransition();

  if (editing) {
    return <PostEditor post={editing.post} isNew={editing.isNew} onClose={() => setEditing(null)} />;
  }

  const activePosts = posts.filter((post) => !post.archived);
  const archivedPosts = posts.filter((post) => post.archived);
  const visiblePosts = view === "active" ? activePosts : archivedPosts;

  function handleArchive(post: Post, archived: boolean) {
    startTransition(async () => {
      const result = await setPostArchived(post.slug, archived);
      if (!result.ok) alert(result.error);
    });
  }

  function handleDelete(post: Post) {
    if (!confirm(`Apagar o post "${post.pt.title}"? Isso não pode ser desfeito.`)) return;
    startTransition(async () => {
      const result = await deletePost(post.slug);
      if (!result.ok) alert(result.error);
    });
  }

  const viewClass = (name: View) =>
    `rounded-full px-4 py-1.5 text-xs transition-colors ${
      view === name ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
    }`;

  return (
    <div className="px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-3xl md:text-4xl">
              Posts do <span className="text-[#E8C39E]">blog</span>
            </h1>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setView("active")} className={viewClass("active")}>
                Ativos ({activePosts.length})
              </button>
              <button type="button" onClick={() => setView("archived")} className={viewClass("archived")}>
                Arquivados ({archivedPosts.length})
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing({ post: newPost, isNew: true })}
            className="inline-flex items-center gap-2 rounded-full bg-[#E8C39E] px-5 py-2.5 text-sm font-semibold text-[#004D4C] transition-colors hover:bg-white"
          >
            <Plus className="size-4" /> Novo post
          </button>
        </header>

        {view === "archived" && (
          <p className="mt-4 text-xs text-white/60">
            Posts arquivados não aparecem no site. Desarquive para voltar a mostrá-los.
          </p>
        )}

        {visiblePosts.length === 0 ? (
          <p className="py-20 text-center text-white/60">
            {view === "active" ? "Nenhum post ainda. Clique em “Novo post”." : "Nenhum post arquivado."}
          </p>
        ) : (
          <ul className={`mt-6 divide-y divide-white/10 ${pending ? "opacity-60" : ""}`}>
            {visiblePosts.map((post) => (
              <li key={post.slug} className="flex flex-wrap items-center gap-4 py-4">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-white/5">
                  {post.coverUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={optimizeImage(post.coverUrl, IMAGE_WIDTHS.thumb)} alt="" className="h-full w-full object-cover" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{post.pt.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/60">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider ${
                        post.published ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {post.published ? "Publicado" : "Rascunho"}
                    </span>
                    {!post.en.title && <span className="text-yellow-300/80">Sem versão em inglês</span>}
                    <span>{formatPostDate(post.createdAt, "PT")}</span>
                    <span>/blog/{post.slug}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {post.published && !post.archived && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver no site"
                      className="rounded-full border border-white/15 p-2 text-white/80 hover:border-[#E8C39E] hover:text-[#E8C39E]"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditing({ post, isNew: false })}
                    title="Editar"
                    className="rounded-full border border-white/15 p-2 text-white/80 hover:border-[#E8C39E] hover:text-[#E8C39E]"
                  >
                    <Pencil className="size-4" />
                  </button>

                  {post.archived ? (
                    <button
                      type="button"
                      onClick={() => handleArchive(post, false)}
                      disabled={pending}
                      className={`${smallButton} hover:border-[#E8C39E] hover:text-[#E8C39E]`}
                    >
                      <ArchiveRestore className="size-4" /> Desarquivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleArchive(post, true)}
                      disabled={pending}
                      className={`${smallButton} hover:border-[#E8C39E] hover:text-[#E8C39E]`}
                    >
                      <Archive className="size-4" /> Arquivar
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    disabled={pending}
                    className={`${smallButton} hover:border-red-400 hover:text-red-300`}
                  >
                    <Trash2 className="size-4" /> Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
