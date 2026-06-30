"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { articlePages } from "@/config/articles";

export function InsightsSection() {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePage((current) => (current + 1) % articlePages.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const articles = articlePages[activePage];

  return (
    <section
      id="insights"
      aria-labelledby="insights-title"
      className="bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-tight text-blue-600">
              Knowledge Center
            </span>

            <h2
              id="insights-title"
              className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              Technology Insights &amp; Resources
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
              Stay informed with the latest technology trends, industry
              insights, best practices, and expert perspectives to support your
              digital transformation journey.
            </p>
          </div>

          <Link
            href="/articles"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-3 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            View All Articles
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

        <div
          id="articles"
          className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {articles.map((article, index) => (
            <Reveal
              key={article.slug}
              delay={index * 90}
              className="group overflow-hidden bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <Link
                href={`/articles/${article.slug}`}
                className="relative block aspect-[16/6] overflow-hidden bg-blue-100"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <span className="border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                    {article.category}
                  </span>

                  <span className="text-xs font-medium text-slate-400">
                    {article.readTime}
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-3 min-h-[72px] text-[15px] font-bold leading-6 text-slate-950">
                  {article.title}
                </h3>

                <div className="mt-6 flex items-center justify-between">
                  <time className="text-xs font-medium text-slate-400">
                    {article.date}
                  </time>

                  <Link
                    href={`/articles/${article.slug}`}
                    aria-label={`Read article: ${article.title}`}
                    className="text-slate-400 transition group-hover:text-blue-600"
                  >
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div
          className="mt-8 flex justify-center gap-3"
          aria-label="Article carousel pages"
        >
          {articlePages.map((page, index) => (
            <button
              key={page[0].slug}
              type="button"
              aria-label={`Show article page ${index + 1}`}
              aria-current={activePage === index ? "true" : undefined}
              onClick={() => setActivePage(index)}
              className={`h-1.5 rounded-full transition-all ${
                activePage === index
                  ? "w-8 bg-blue-600"
                  : "w-8 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
