import type { MetadataRoute } from "next";
import { site } from "@/app/utils/site";
import { getServicePath, services } from "@/app/data/services";
import { getPublishedPosts } from "@/lib/posts";

// O sitemap é atualizado sempre que um post é salvo no painel (ver app/admin/blog-actions.ts).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/servicos`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...services.map((service) => ({
      url: `${site.url}${getServicePath(service)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.createdAt ? new Date(post.createdAt) : undefined,
      priority: 0.6,
    })),
  ];
}
