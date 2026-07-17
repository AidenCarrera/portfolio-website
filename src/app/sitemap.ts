import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", SITE_URL).toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/projects", SITE_URL).toString(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: new URL("/music", SITE_URL).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/contact", SITE_URL).toString(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
