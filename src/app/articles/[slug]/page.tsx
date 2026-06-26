import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/components/shared/container";
import { articles } from "@/config/articles";

type ArticleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="bg-white text-slate-950">
      <article className="pt-18">
        <Container className="py-12 sm:py-16 lg:py-20">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back to Articles
          </Link>

          <header className="mt-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-4">
              <span className="border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase text-slate-500">
                {article.category}
              </span>
              <span className="text-sm font-medium text-slate-400">
                {article.readTime}
              </span>
              <time className="text-sm font-medium text-slate-400">
                {article.date}
              </time>
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-500">
              {article.excerpt}
            </p>
          </header>

          <div className="relative mt-10 aspect-[16/7] overflow-hidden bg-blue-100">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-10">
            {article.content.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold tracking-[-0.04em] text-slate-950">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-5 text-base leading-8 text-slate-600">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </article>
    </main>
  );
}
