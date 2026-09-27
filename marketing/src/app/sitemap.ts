import type { MetadataRoute } from "next";
import { posts } from "../data/posts";

export const dynamic = "force-static";

const SITE_URL = "https://linkpower.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogEntries,
    ...["linkpower-3-quick-start", "linkpower-3-connection-guide", "troubleshooting"].map((slug) => ({
      url: `${SITE_URL}/${slug}/`, lastModified, changeFrequency: "monthly" as const, priority: 0.8,
    })),
    {
      url: `${SITE_URL}/manual/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/linkpower-1-quick-start/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/linkpower-2-quick-start/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/support/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
