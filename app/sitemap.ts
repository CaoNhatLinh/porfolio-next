import type { MetadataRoute } from "next";
import { getPublicArticles, getPublicProjects } from "./features/content/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, projects] = await Promise.all([getPublicArticles(), getPublicProjects()]);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const routes = ["", "/work", "/about", "/journal", "/resume", "/hire", "/contact", "/playroom"];
  return [...routes.map((route) => ({ url: `${base}${route}`, changeFrequency: "monthly" as const, priority: route === "" ? 1 : .7 })), ...projects.map((project) => ({ url: `${base}/work/${project.slug}`, changeFrequency: "yearly" as const, priority: project.isFeatured ? .8 : .6 })), ...articles.map((article) => ({ url: `${base}/journal/${article.slug}`, lastModified: article.date, changeFrequency: "yearly" as const, priority: .6 }))];
}
