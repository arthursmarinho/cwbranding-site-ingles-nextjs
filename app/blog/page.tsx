import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { BlogList } from "./BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "CWBranding insights on branding, digital marketing, and paid traffic to help your brand grow.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return <BlogList posts={posts} />;
}
