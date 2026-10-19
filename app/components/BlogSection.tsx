"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { PostCard } from "../blog/PostCard";
import type { Post } from "../blog/types";
import { Reveal } from "./ui/Reveal";

// Seção da home com os posts mais recentes. Se não houver posts publicados, não aparece.
export function BlogSection({ posts }: { posts: Post[] }) {
  const { t } = useLanguage();

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-16 bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl tracking-tight text-[#004d4c] md:text-5xl">
                <span className="italic">{t.blogTitleLine1}</span> {t.blogTitleLine2}
              </h2>
              <p className="mt-4 text-[#004d4c]/75">{t.blogDescription}</p>
            </div>
            <Link
              href="/blog"
              className="rounded-full border border-[#004d4c]/20 px-6 py-3 text-sm font-medium text-[#004d4c] transition-colors hover:border-[#004d4c] hover:bg-[#004d4c] hover:text-white"
            >
              {t.blogSeeAll}
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
