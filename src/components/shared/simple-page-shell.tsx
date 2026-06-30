import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

type SimplePageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function SimplePageShell({
  eyebrow,
  title,
  description,
  children,
}: SimplePageShellProps) {
  return (
    <main className="bg-white pt-18 text-slate-950">
      <section className="border-b border-slate-200 bg-[#0d2f86] text-white">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
              {eyebrow}
            </span>
            <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-cyan-100 sm:text-4xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
              {description}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 sm:py-16 lg:py-20">
        <Container>
          <Reveal className="border border-slate-200 bg-white p-7 sm:p-10">
            {children ?? (
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-slate-950">
                  Page content is being prepared
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Halaman ini sudah disiapkan sebagai entry point resmi dan akan
                  dikembangkan lebih lanjut ketika konten final tersedia.
                </p>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex min-h-11 items-center justify-center bg-blue-600 px-7 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Contact Sales
                </Link>
              </div>
            )}
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
