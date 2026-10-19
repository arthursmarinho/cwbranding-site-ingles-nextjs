"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { IMAGE_WIDTHS, optimizeImage } from "./optimizeImage";
import { formatPostDate, getPostText, type Post } from "./types";

// Card de um post: capa, data, título e resumo. Usado na home e em /blog.
// priority: carrega a imagem logo de cara (para os cards que aparecem no topo da página).
export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const { language, t } = useLanguage();
  const text = getPostText(post, language);

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#004d4c]/10">
        {post.coverUrl && (
          <Image
            src={optimizeImage(post.coverUrl, IMAGE_WIDTHS.card)}
            alt={text.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#004d4c]/60">
        {formatPostDate(post.createdAt, language)}
      </p>
      <h3 className="mt-2 text-xl font-medium leading-snug text-[#004d4c] group-hover:underline">
        {text.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-[#004d4c]/75">{text.excerpt}</p>
      <span className="mt-4 text-sm font-semibold text-[#0E6B67]">{t.blogReadMore} →</span>
    </Link>
  );
}
