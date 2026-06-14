import { MetadataRoute } from "next";
import { teams, news } from "@/lib/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://worldcup2026.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "always" as const, priority: 1.0 },
    { url: `${baseUrl}/live-scores`, lastModified: new Date(), changeFrequency: "always" as const, priority: 0.9 },
    { url: `${baseUrl}/schedule`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/standings`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${baseUrl}/predictions`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.8 },
  ];

  const teamPages = teams.map((team) => ({
    url: `${baseUrl}/teams/${team.id}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const newsPages = news.map((article) => ({
    url: `${baseUrl}/news/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...teamPages, ...newsPages];
}
