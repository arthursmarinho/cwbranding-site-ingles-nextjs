"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Trash2,
} from "lucide-react";
import { IMAGE_WIDTHS, optimizeImage } from "../blog/optimizeImage";
import { PostContent } from "../blog/PostContent";
import { slugify, type Post, type PostText } from "../blog/types";
import { deletePost, savePost, uploadImage, type PostInput } from "./blog-actions";

type Lang = "pt" | "en";

const MAX_IMAGE_MB = 4;

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-[#003533]/70 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-[#E8C39E]/70";

const labelClass = "mb-2 block text-[10px] font-medium uppercase tracking-[0.25em] text-white/85";

// Envia a imagem escolhida para o ImageKit e devolve o link (ou null se der erro).
async function sendImage(file: File): Promise<string | null> {
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    alert(`A imagem tem mais de ${MAX_IMAGE_MB}MB. Escolha uma menor.`);
    return null;
  }
  const formData = new FormData();
  formData.append("file", file);
  const result = await uploadImage(formData);
  if (!result.ok) {
    alert(result.error);
    return null;
  }
  return result.url;
}

// Tela de criar/editar um post.
export function PostEditor({
  post,
  isNew,
  onClose,
}: {
  post: Post;
  isNew: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PostInput>({
    slug: post.slug,
    coverUrl: post.coverUrl,
    published: post.published,
    pt: post.pt,
    en: post.en,
  });
  const [lang, setLang] = useState<Lang>("pt");
  const [preview, setPreview] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const text = form[lang];

  // Atualiza um campo do texto no idioma aberto (título, resumo ou conteúdo).
  function setText(field: keyof PostText, value: string) {
    setForm((f) => {
      const next = { ...f, [lang]: { ...f[lang], [field]: value } };
      // Em post novo, o endereço acompanha o título em português até ser editado à mão.
      if (lang === "pt" && field === "title" && !slugEdited) next.slug = slugify(value);
      return next;
    });
  }

  async function handleCover(file: File | undefined) {
    if (!file) return;
    setUploadingCover(true);
    const url = await sendImage(file);
    if (url) setForm((f) => ({ ...f, coverUrl: url }));
    setUploadingCover(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    const result = await savePost(form, isNew);
    setSaving(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  async function handleDelete() {
    if (!confirm(`Apagar o post "${post.pt.title}"? Isso não pode ser desfeito.`)) return;
    setSaving(true);
    const result = await deletePost(post.slug);
    setSaving(false);
    if (result.ok) onClose();
    else setError(result.error);
  }

  return (
    <div className="px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-[1400px]">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Voltar para a lista
        </button>
        <h1 className="mt-4 font-display text-3xl md:text-4xl">
          {isNew ? "Novo post" : "Editar post"}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Coluna principal: textos em PT e EN */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <LangButton active={lang === "pt"} onClick={() => setLang("pt")}>
                  🇧🇷 Português
                </LangButton>
                <LangButton active={lang === "en"} onClick={() => setLang("en")}>
                  🇨🇦 English
                </LangButton>
              </div>
              <div className="flex gap-2">
                <LangButton active={!preview} onClick={() => setPreview(false)}>
                  Escrever
                </LangButton>
                <LangButton active={preview} onClick={() => setPreview(true)}>
                  Visualizar
                </LangButton>
              </div>
            </div>

            {lang === "en" && (
              <p className="text-xs text-white/60">
                Se a versão em inglês ficar vazia, o site mostra a versão em português.
              </p>
            )}

            {preview ? (
              <div className="rounded-2xl bg-white p-6 md:p-10">
                <h2 className="font-display text-4xl text-[#004d4c]">{text.title || "Sem título"}</h2>
                {text.excerpt && <p className="mt-4 text-lg text-[#004d4c]/75">{text.excerpt}</p>}
                <div className="mt-8">
                  <PostContent content={text.content} />
                </div>
              </div>
            ) : (
              // key={lang}: troca os campos ao mudar de idioma, para o corretor usar o idioma certo.
              <div key={lang} className="space-y-5">
                <div>
                  <label htmlFor="post-title" className={labelClass}>
                    Título
                  </label>
                  <input
                    id="post-title"
                    lang={lang === "pt" ? "pt-BR" : "en"}
                    spellCheck
                    value={text.title}
                    onChange={(e) => setText("title", e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="post-excerpt" className={labelClass}>
                    Resumo (aparece nos cards)
                  </label>
                  <textarea
                    id="post-excerpt"
                    lang={lang === "pt" ? "pt-BR" : "en"}
                    spellCheck
                    rows={2}
                    value={text.excerpt}
                    onChange={(e) => setText("excerpt", e.target.value)}
                    className={`${fieldClass} resize-y`}
                  />
                </div>
                <div>
                  <span className={labelClass}>Texto</span>
                  <MarkdownEditor
                    lang={lang}
                    value={text.content}
                    onChange={(value) => setText("content", value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Coluna lateral: endereço, capa, status e salvar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div>
              <label htmlFor="post-slug" className={labelClass}>
                Endereço do post
              </label>
              <input
                id="post-slug"
                value={form.slug}
                disabled={!isNew}
                onChange={(e) => {
                  setSlugEdited(true);
                  setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
                }}
                className={`${fieldClass} disabled:opacity-60`}
              />
              <p className="mt-1.5 text-xs text-white/50">
                /blog/{form.slug || "..."}
                {!isNew && " · não pode ser alterado depois de criado"}
              </p>
            </div>

            <div>
              <span className={labelClass}>Imagem de capa</span>
              {form.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={optimizeImage(form.coverUrl, IMAGE_WIDTHS.card)}
                  alt=""
                  className="mb-3 aspect-[4/3] w-full rounded-xl object-cover"
                />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/85 hover:border-[#E8C39E] hover:text-[#E8C39E]">
                <ImagePlus className="size-4" />
                {uploadingCover ? "Enviando..." : form.coverUrl ? "Trocar imagem" : "Escolher imagem"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingCover}
                  onChange={(e) => handleCover(e.target.files?.[0])}
                />
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                className="size-4 accent-[#E8C39E]"
              />
              Publicado (aparece no site)
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || uploadingCover}
              className="h-11 w-full rounded-full bg-[#E8C39E] text-sm font-semibold text-[#004D4C] transition-colors hover:bg-white disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>

            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-400/40 text-sm text-red-300 transition-colors hover:bg-red-400/10 disabled:opacity-60"
              >
                <Trash2 className="size-4" /> Apagar post
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function LangButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
        active ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// Botões da barra de formatação: o que cada um coloca antes e depois do texto selecionado.
const TOOLBAR = [
  { icon: Heading2, title: "Título", before: "\n## ", after: "" },
  { icon: Heading3, title: "Subtítulo", before: "\n### ", after: "" },
  { icon: Bold, title: "Negrito", before: "**", after: "**" },
  { icon: Italic, title: "Itálico", before: "_", after: "_" },
  { icon: List, title: "Lista", before: "\n- ", after: "" },
  { icon: ListOrdered, title: "Lista numerada", before: "\n1. ", after: "" },
  { icon: Quote, title: "Citação", before: "\n> ", after: "" },
  { icon: Link, title: "Link", before: "[", after: "](https://)" },
];

// Caixa de texto com botões que inserem a formatação (Markdown) no ponto do cursor.
function MarkdownEditor({
  lang,
  value,
  onChange,
}: {
  lang: Lang;
  value: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [uploading, setUploading] = useState(false);

  // Coloca "before" e "after" em volta do texto selecionado.
  // Ex.: negrito com "oi" selecionado -> "**oi**"
  function insert(before: string, after = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    onChange(value.slice(0, start) + before + selected + after + value.slice(end));

    // Depois de atualizar o texto, mantém o cursor no lugar certo.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    });
  }

  async function handleImage(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const url = await sendImage(file);
    if (url) insert(`\n![Descrição da imagem](${url})\n`);
    setUploading(false);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#003533]/70 focus-within:border-[#E8C39E]/70">
      <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
        {TOOLBAR.map(({ icon: Icon, title, before, after }) => (
          <button
            key={title}
            type="button"
            title={title}
            onClick={() => insert(before, after)}
            className="rounded-lg p-2 text-white/75 hover:bg-white/10 hover:text-white"
          >
            <Icon className="size-4" />
          </button>
        ))}
        <label
          title="Inserir imagem"
          className="cursor-pointer rounded-lg p-2 text-white/75 hover:bg-white/10 hover:text-white"
        >
          {uploading ? <span className="text-xs">Enviando...</span> : <ImagePlus className="size-4" />}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleImage(e.target.files?.[0])}
          />
        </label>
      </div>
      <textarea
        ref={textareaRef}
        lang={lang === "pt" ? "pt-BR" : "en"}
        spellCheck
        rows={20}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva o post aqui. Use os botões acima para formatar."
        className="block w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-white placeholder:text-white/40 outline-none"
      />
    </div>
  );
}
