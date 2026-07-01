import type { Metadata } from "next";

import { ArticlesPageContent } from "@/components/articles/articles-page-content";
import { getArticles } from "@/sanity/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Technology insights, resources, and best practices from Indoteksaft.",
  alternates: {
    canonical: "/articles",
  },
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return <ArticlesPageContent articles={articles} />;
}
