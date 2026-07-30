import type { MetadataRoute } from "next";
import { getGithubRepos } from "@/lib/github";
import { getProjectSlug } from "@/lib/projects";
import { SITE_URL } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repos = await getGithubRepos();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/projects`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/music`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = repos.map((repo) => ({
    url: `${SITE_URL}/projects/${getProjectSlug(repo)}`,
    lastModified: new Date(repo.createdAt),
    changeFrequency: "monthly",
    priority: repo.isFeatured ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
