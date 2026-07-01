"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { pickLocalized } from "@/lib/i18n/localized-content";
import type { CmsArticleSummary } from "@/sanity/articles";

type ArticlesPageContentProps = {
  articles: CmsArticleSummary[];
};

export function ArticlesPageContent({ articles }: ArticlesPageContentProps) {
  const { locale } = useLanguage();

  return (
    <main className="bg-white text-slate-950">
      <section className="bg-slate-50 pt-18">
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {locale === "id" ? "Pusat Pengetahuan" : "Knowledge Center"}
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {locale === "id"
                ? "Insight Teknologi & Sumber Daya"
                : "Technology Insights & Resources"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
              {locale === "id"
                ? "Jelajahi tren teknologi, insight industri, praktik terbaik, dan perspektif ahli untuk mendukung perjalanan transformasi digital Anda."
                : "Explore technology trends, industry insights, best practices, and expert perspectives to support your digital transformation journey."}
            </p>
          </div>
        </Container>
      </section>

      <section aria-label="All articles" className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const title = pickLocalized(article.title, locale);
              const excerpt = pickLocalized(article.excerpt, locale);
              const category = pickLocalized(article.category, locale);

              return (
                <article
                  key={article.slug}
                  className="group overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  data-i18n-skip
                >
                  <Link
                    href={`/articles/${article.slug}`}
                    className="relative block aspect-[16/6] overflow-hidden bg-blue-100"
                  >
                    <Image
                      src={article.image}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <span className="border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                        {category}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="mt-4 line-clamp-3 min-h-[72px] text-[15px] font-bold leading-6 text-slate-950">
                      <Link href={`/articles/${article.slug}`}>{title}</Link>
                    </h2>

                    <p className="mt-4 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                      {excerpt}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <time className="text-xs font-medium text-slate-400">
                        {article.date}
                      </time>
                      <Link
                        href={`/articles/${article.slug}`}
                        aria-label={`Read article: ${title}`}
                        className="text-slate-400 transition group-hover:text-blue-600"
                      >
                        <ArrowUpRight aria-hidden="true" size={18} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
