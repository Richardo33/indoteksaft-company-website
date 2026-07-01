import "server-only";

import { draftMode } from "next/headers";

import { articles as staticArticles, type Article } from "@/config/articles";
import type { LocalizedText } from "@/lib/i18n/localized-content";
import { sanityClient } from "@/sanity/client";

export type CmsArticleSummary = {
  slug: string;
  category: LocalizedText;
  readTime: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  date: string;
  image: string;
};

export type CmsArticleDetail = CmsArticleSummary & {
  content: {
    heading: LocalizedText;
    body: LocalizedText[];
  }[];
};

function localized(en?: string, id?: string): LocalizedText {
  return { en, id: id ?? en };
}

function localizedList(items: readonly string[]): LocalizedText[] {
  return items.map((item) => localized(item));
}

function fallbackSummary(article: Article): CmsArticleSummary {
  return {
    slug: article.slug,
    category: localized(article.category),
    readTime: article.readTime,
    title: localized(article.title),
    excerpt: localized(article.excerpt),
    date: article.date,
    image: article.image,
  };
}

function fallbackDetail(article: Article): CmsArticleDetail {
  return {
    ...fallbackSummary(article),
    content: article.content.map((section) => ({
      heading: localized(section.heading),
      body: localizedList(section.body),
    })),
  };
}

function formatArticleDate(date?: string | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

async function getSanityFetchClient() {
  const draft = await draftMode();
  const token =
    process.env.SANITY_API_READ_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    undefined;

  return sanityClient.withConfig({
    token,
    useCdn: false,
    perspective: draft.isEnabled && token ? "drafts" : "published",
  });
}

const articleSummaryFields = `
  "slug": slug.current,
  "category": {
    "en": coalesce(category->nameI18n.en, categoryNameI18n.en, category->name, categoryName, "Article"),
    "id": coalesce(category->nameI18n.id, categoryNameI18n.id, category->nameI18n.en, categoryNameI18n.en, category->name, categoryName, "Artikel")
  },
  readTime,
  "title": {
    "en": coalesce(titleI18n.en, title),
    "id": coalesce(titleI18n.id, titleI18n.en, title)
  },
  "excerpt": {
    "en": coalesce(excerptI18n.en, excerpt),
    "id": coalesce(excerptI18n.id, excerptI18n.en, excerpt)
  },
  "date": coalesce(publishedAt, _createdAt),
  "image": coverImage.asset->url
`;

const articlesQuery = `*[
  _type == "article" &&
  status == "published"
] | order(coalesce(publishedAt, _createdAt) desc) {
  ${articleSummaryFields}
}`;

const articleDetailQuery = `*[
  _type == "article" &&
  slug.current == $slug &&
  status == "published"
][0] {
  ${articleSummaryFields},
  "content": coalesce(sections, [])[] {
    "heading": {
      "en": coalesce(headingI18n.en, heading),
      "id": coalesce(headingI18n.id, headingI18n.en, heading)
    },
    "bodyI18n": bodyI18n,
    "bodyLegacy": body
  }
}`;

const articleSlugsQuery = `*[
  _type == "article" &&
  status == "published" &&
  defined(slug.current)
] { "slug": slug.current }`;

export async function getArticles(): Promise<CmsArticleSummary[]> {
  try {
    const client = await getSanityFetchClient();
    const rows = await client.fetch<
      (Omit<CmsArticleSummary, "date" | "image"> & {
        date?: string;
        image?: string;
      })[]
    >(articlesQuery, {}, { cache: "no-store" });

    const fallback = staticArticles.map(fallbackSummary);
    const articles = rows
      .filter((article) => article.slug && article.title)
      .map((article, index) => ({
        slug: article.slug,
        category: article.category,
        readTime: article.readTime ?? "5 min read",
        title: article.title,
        excerpt: article.excerpt,
        date: formatArticleDate(article.date),
        image: article.image ?? fallback[index % fallback.length]?.image ?? "/images/industry-enterprise.png",
      }));

    if (articles.length > 0) {
      return articles;
    }
  } catch (error) {
    console.warn("Failed to load articles from Sanity, using fallback.", error);
  }

  return staticArticles.map(fallbackSummary);
}

export async function getArticleBySlug(
  slug: string,
): Promise<CmsArticleDetail | null> {
  try {
    const client = await getSanityFetchClient();
    const article = await client.fetch<
      (Omit<CmsArticleDetail, "date" | "image" | "content"> & {
        date?: string;
        image?: string;
        content?: {
          heading: LocalizedText;
          bodyI18n?: LocalizedText[] | null;
          bodyLegacy?: string[] | null;
        }[];
      }) | null
    >(articleDetailQuery, { slug }, { cache: "no-store" });

    if (article) {
      const fallback = staticArticles.find((item) => item.slug === slug);
      return {
        slug: article.slug,
        category: article.category,
        readTime: article.readTime ?? "5 min read",
        title: article.title,
        excerpt: article.excerpt,
        date: formatArticleDate(article.date),
        image: article.image ?? fallback?.image ?? "/images/industry-enterprise.png",
        content: (article.content ?? []).map((section) => ({
          heading: section.heading,
          body:
            section.bodyI18n && section.bodyI18n.length > 0
              ? section.bodyI18n
              : localizedList(section.bodyLegacy ?? []),
        })),
      };
    }
  } catch (error) {
    console.warn("Failed to load article from Sanity, using fallback.", error);
  }

  const fallback = staticArticles.find((item) => item.slug === slug);
  return fallback ? fallbackDetail(fallback) : null;
}

export async function getArticleSlugs() {
  try {
    const token =
      process.env.SANITY_API_READ_TOKEN ||
      process.env.SANITY_API_WRITE_TOKEN ||
      undefined;
    const client = sanityClient.withConfig({
      token,
      useCdn: false,
      perspective: "published",
    });
    const rows = await client.fetch<{ slug: string }[]>(
      articleSlugsQuery,
      {},
      { cache: "no-store" },
    );

    if (rows.length > 0) {
      return rows.map((row) => row.slug);
    }
  } catch (error) {
    console.warn("Failed to load article slugs from Sanity, using fallback.", error);
  }

  return staticArticles.map((article) => article.slug);
}
