import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleDetailContent } from "@/components/articles/article-detail-content";
import { pickLocalized } from "@/lib/i18n/localized-content";
import {
  getArticleBySlug,
  getArticleSlugs,
} from "@/sanity/articles";

type ArticleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const title = pickLocalized(article.title, "en");
  const description = pickLocalized(article.excerpt, "en");

  return {
    title,
    description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetailContent article={article} />;
}
