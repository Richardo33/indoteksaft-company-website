"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";

const resourcePages = [
  [
    {
      category: "Software Development",
      readTime: "5 min read",
      title:
        "Transformasi Digital: Mengapa Web Development Adalah Infrastruktur Utama Bisnis, Bukan Sekadar Etalase",
      date: "April 19, 2026",
      image: "/images/industry-enterprise.png",
    },
    {
      category: "Cybersecurity",
      readTime: "6 min read",
      title:
        "Zero-Trust untuk Infrastruktur Kritis: Cara Membangun Keamanan yang Terukur",
      date: "April 21, 2026",
      image: "/images/industry-defense.png",
    },
    {
      category: "Cloud Strategy",
      readTime: "4 min read",
      title:
        "Hybrid Cloud dan Sovereign Data: Fondasi Baru Transformasi Enterprise",
      date: "April 24, 2026",
      image: "/images/industry-government.png",
    },
  ],
  [
    {
      category: "Infrastructure",
      readTime: "7 min read",
      title:
        "Modernisasi Data Center: Menyiapkan Availability untuk Operasi 24/7",
      date: "May 02, 2026",
      image: "/images/industry-healthcare.png",
    },
    {
      category: "Telecommunication",
      readTime: "5 min read",
      title:
        "Smart Site Monitoring: Meningkatkan Visibilitas Jaringan Telekomunikasi",
      date: "May 08, 2026",
      image: "/images/industry-telecom.png",
    },
    {
      category: "Data & AI",
      readTime: "6 min read",
      title:
        "Dari Monitoring ke Prediksi: Peran AI dalam Operasi Teknologi Modern",
      date: "May 14, 2026",
      image: "/images/industry-education.png",
    },
  ],
] as const;

export function PortfolioSection() {
  const [activePage, setActivePage] = useState(0);
  const articles = resourcePages[activePage];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivePage((current) => (current + 1) % resourcePages.length);
    }, 2_500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      id="resources"
      aria-labelledby="resources-title"
      className="bg-slate-50 py-16 text-slate-950 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Knowledge Center
            </span>
            <h2
              id="resources-title"
              className="mt-5 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl"
            >
              Technology Insights & Resources
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
              Stay informed with the latest technology trends, industry
              insights, best practices, and expert perspectives to support your
              digital transformation journey.
            </p>
          </div>

          <a
            href="#resources"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 border border-blue-600 px-7 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            View All Articles
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="group bg-white">
              <div className="relative aspect-[16/6] overflow-hidden bg-cyan-50">
                <Image
                  src={article.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-center opacity-90 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-cyan-100/45 mix-blend-screen" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-wide text-slate-400">
                  <span className="border border-slate-200 px-2 py-1">
                    {article.category}
                  </span>
                  <span className="normal-case">{article.readTime}</span>
                </div>
                <h3 className="mt-5 min-h-20 text-base font-bold leading-6 text-slate-950">
                  {article.title}
                </h3>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-400">{article.date}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    className="text-slate-400 transition group-hover:text-blue-600"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {resourcePages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show resource page ${index + 1}`}
              aria-pressed={activePage === index}
              className={`h-1.5 rounded-full transition-all ${
                activePage === index
                  ? "w-9 bg-blue-600"
                  : "w-9 bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={() => setActivePage(index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
