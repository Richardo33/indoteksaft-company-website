import type { MetadataRoute } from "next";

import { env } from "@/lib/server/env";
import { getArticleSlugs } from "@/sanity/articles";
import { getProductSlugs } from "@/sanity/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [productSlugs, articleSlugs] = await Promise.all([
    getProductSlugs(),
    getArticleSlugs(),
  ]);

  return [
    {
      url: env.SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${env.SITE_URL}/products`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.SITE_URL}/solutions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.SITE_URL}/industries`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${env.SITE_URL}/company`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${env.SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${env.SITE_URL}/careers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${env.SITE_URL}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    {
      url: `${env.SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.35,
    },
    ...productSlugs.map((slug) => ({
      url: `${env.SITE_URL}/products/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${env.SITE_URL}/articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${env.SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${env.SITE_URL}/resources/portfolio`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${env.SITE_URL}/resources/client`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${env.SITE_URL}/resources/brosur`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${env.SITE_URL}/resources/event`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articleSlugs.map((slug) => ({
      url: `${env.SITE_URL}/articles/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
