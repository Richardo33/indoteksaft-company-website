import type { MetadataRoute } from "next";

import { env } from "@/lib/server/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: env.SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
