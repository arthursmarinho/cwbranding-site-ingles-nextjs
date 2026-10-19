import { notFound } from "next/navigation";

/* Blog disabled for now
import type { Metadata } from "next";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { BlogPost } from "../BlogPost";
import { IMAGE_WIDTHS, optimizeImage } from "../optimizeImage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function postMeta(post: NonNullable<Awaited<ReturnType<typeof getPublishedPost>>>) {
  return post.en.title ? post.en : post.pt;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post not found" };

  const meta = postMeta(post);

  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.excerpt,
      type: "article",
      images: post.coverUrl ? [{ url: optimizeImage(post.coverUrl, IMAGE_WIDTHS.share, "jpg") }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts()).filter((item) => item.slug !== post.slug).slice(0, 3);

  return <BlogPost post={post} related={related} />;
}
*/

export default function BlogPostPage() {
  notFound();
}
