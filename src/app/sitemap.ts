import type { MetadataRoute } from "next";
import { getArticles } from "./media/lib/articles";

const siteUrl = "https://algion.co.jp";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const staticRoutes = ["", "/services", "/media", "/about", "/contact", "/privacy"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}/`,
      changeFrequency: route === "" ? "monthly" as const : "yearly" as const,
      priority: route === "" ? 1 : route === "/services" ? 0.9 : 0.6,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/media/${article.slug}/`,
      lastModified: article.rawDate ?? undefined,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
