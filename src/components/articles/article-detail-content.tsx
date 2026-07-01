"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/shared/container";
import { pickLocalized, pickLocalizedList } from "@/lib/i18n/localized-content";
import type { CmsArticleDetail } from "@/sanity/articles";

type ArticleDetailContentProps = {
  article: CmsArticleDetail;
};

export function ArticleDetailContent({ article }: ArticleDetailContentProps) {
  const { locale } = useLanguage();
  const title = pickLocalized(article.title, locale);
  const excerpt = pickLocalized(article.excerpt, locale);
  const category = pickLocalized(article.category, locale);

  return (
    <main className="bg-white text-slate-950" data-i18n-skip>
      <article className="pt-18">
        <Container className="py-12 sm:py-16 lg:py-20">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            {locale === "id" ? "Kembali ke Artikel" : "Back to Articles"}
          </Link>

          <header className="mt-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-4">
              <span className="border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                {category}
              </span>
              <span className="text-sm font-medium text-slate-400">
                {article.readTime}
              </span>
              <time className="text-sm font-medium text-slate-400">
                {article.date}
              </time>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-500">
              {excerpt}
            </p>
          </header>

          <div className="relative mt-10 aspect-[16/7] overflow-hidden bg-blue-100">
            <Image
              src={article.image}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-10">
            {article.content.map((section, index) => {
              const heading = pickLocalized(section.heading, locale);
              const paragraphs = pickLocalizedList(section.body, locale);

              return (
                <section key={`${heading}-${index}`}>
                  <h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-950">
                    {heading}
                  </h2>
                  <div className="mt-4 space-y-5 text-base leading-8 text-slate-600">
                    {paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </Container>
      </article>
    </main>
  );
}
