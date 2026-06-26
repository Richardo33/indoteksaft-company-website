"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { softwareProductPages, type ProductTheme } from "@/config/products";

export function EnterpriseSoftwareSection() {
  const [activePage, setActivePage] = useState(0);
  const products = softwareProductPages[activePage];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActivePage((current) => (current + 1) % softwareProductPages.length);
    }, 2_500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section
      aria-labelledby="enterprise-software-title"
      className="bg-[#0d2f86] py-16 text-white sm:py-20 lg:py-24"
    >
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              Products
            </span>
            <h2
              id="enterprise-software-title"
              className="mt-5 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl"
            >
              Enterprise Software Solutions
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/85">
              Scalable software products engineered to help organizations
              innovate faster, improve efficiency, and stay ahead in a
              digital-first world.
            </p>
          </div>

          <a
            href="#products"
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 border border-white/70 px-7 text-sm font-semibold text-white transition hover:bg-white hover:text-[#0d2f86]"
          >
            All Products
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="text-center">
              <LaptopMockup theme={product.theme} />
              <h3 className="mx-auto mt-6 line-clamp-2 min-h-12 max-w-64 text-sm font-bold leading-6 text-white">
                {product.name}
              </h3>
            </article>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-3">
          {softwareProductPages.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show product page ${index + 1}`}
              aria-pressed={activePage === index}
              className={`h-1.5 rounded-full transition-all ${
                activePage === index
                  ? "w-9 bg-blue-500"
                  : "w-9 bg-white/20 hover:bg-white/35"
              }`}
              onClick={() => setActivePage(index)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

type LaptopMockupProps = {
  theme: ProductTheme;
  surfaceClassName?: string;
  fadeClassName?: string;
};

export function LaptopMockup({
  theme,
  surfaceClassName = "bg-[#0d2f86]",
  fadeClassName = "via-[#0d2f86]/70 to-[#0d2f86]",
}: LaptopMockupProps) {
  return (
    <div className="relative mx-auto grid aspect-[4/3] w-full max-w-[260px] place-items-center overflow-hidden">
      {/* Background circle */}
      <div className="absolute inset-x-0 -top-0 h-[82%] overflow-hidden p-6">
        <div className="absolute left-1/2 top-1 h-[270px] w-[270px] -translate-x-1/2 rounded-full bg-blue-500/15" />
        <div className="absolute left-1/2 top-8 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-blue-400/15" />
        <div className="absolute left-1/2 top-15 h-[170px] w-[170px] -translate-x-1/2 rounded-full bg-blue-300/12" />

        {/* Fade bawah khusus lingkaran */}
        <div
          className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent ${fadeClassName}`}
        />
      </div>

      {/* Cover bawah agar circle tidak turun sampai area teks */}
      <div className={`absolute inset-x-0 top-[72%] z-10 h-14 ${surfaceClassName}`} />

      {/* Laptop */}
      <div className="relative z-20 mt-10 w-[76%]">
        <div className="rounded-t-md border-[5px] border-slate-950 bg-slate-950 shadow-2xl shadow-black/25">
          <div className="aspect-[16/9] overflow-hidden rounded-sm bg-white p-2">
            <LaptopScreen theme={theme} />
          </div>
        </div>

        <div className="mx-auto h-2 w-[114%] -translate-x-[6%] rounded-b-full bg-gradient-to-b from-slate-200 to-slate-500 shadow-lg" />
      </div>
    </div>
  );
}

function LaptopScreen({ theme }: LaptopMockupProps) {
  if (theme === "map") {
    return (
      <div className="grid h-full grid-cols-[0.7fr_1.3fr] gap-2 text-[4px] text-slate-400">
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-2 rounded bg-slate-100" />
          ))}
        </div>
        <div className="relative rounded bg-cyan-50">
          <div className="absolute inset-3 rounded-full border border-cyan-300" />
          <div className="absolute bottom-2 right-2 size-5 rounded-full bg-emerald-400" />
        </div>
      </div>
    );
  }

  if (theme === "monitoring") {
    return (
      <div className="grid h-full grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="rounded bg-slate-50 p-1">
            <div className="mb-1 h-1 w-6 rounded bg-emerald-300" />
            <div className="h-5 rounded bg-gradient-to-t from-red-100 via-yellow-100 to-cyan-100" />
          </div>
        ))}
      </div>
    );
  }

  if (theme === "noc") {
    return (
      <div className="grid h-full grid-cols-[0.75fr_1.25fr] gap-2 rounded bg-slate-950 p-1">
        <div className="space-y-1">
          {[70, 48, 82, 55].map((width, index) => (
            <div
              key={index}
              className="h-2 rounded bg-blue-400"
              style={{ width: `${width}%` }}
            />
          ))}
          <div className="mt-2 h-8 rounded bg-cyan-400/20" />
        </div>
        <div className="grid grid-cols-2 gap-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded bg-blue-500/20 p-1">
              <div className="h-1.5 w-8 rounded bg-cyan-300" />
              <div className="mt-1 h-6 rounded bg-gradient-to-t from-blue-700 to-cyan-400/40" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (theme === "security") {
    return (
      <div className="relative h-full overflow-hidden rounded bg-slate-50 p-2">
        <div className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-blue-600 text-[8px] font-bold text-white">
          SAFE
        </div>
        <div className="h-2 w-20 rounded bg-blue-500" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-10 rounded border border-cyan-200 bg-white"
            />
          ))}
        </div>
        <div className="mt-3 space-y-1">
          {[86, 62, 74].map((width, index) => (
            <div
              key={index}
              className="h-1.5 rounded bg-cyan-200"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (theme === "workflow") {
    return (
      <div className="h-full rounded bg-slate-50 p-2">
        <div className="mb-2 h-2 w-16 rounded bg-blue-500" />
        <div className="grid h-16 grid-cols-3 items-center gap-2">
          {["01", "02", "03"].map((step) => (
            <div key={step} className="rounded bg-white p-1 shadow-sm">
              <div className="grid size-7 place-items-center rounded-full bg-cyan-100 text-[7px] font-bold text-blue-600">
                {step}
              </div>
              <div className="mt-1 h-1 w-9 rounded bg-slate-200" />
            </div>
          ))}
        </div>
        <div className="mt-2 h-3 rounded bg-blue-100" />
      </div>
    );
  }

  if (theme === "iot") {
    return (
      <div className="relative h-full rounded bg-slate-50 p-2">
        <div className="absolute left-4 top-5 size-8 rounded-full border-2 border-blue-500" />
        <div className="absolute right-5 top-4 size-5 rounded bg-cyan-300" />
        <div className="absolute bottom-4 left-8 h-12 w-2 rounded bg-blue-600" />
        <div className="absolute bottom-4 left-14 h-8 w-2 rounded bg-blue-400" />
        <div className="absolute bottom-4 left-20 h-16 w-2 rounded bg-cyan-400" />
        <div className="absolute bottom-7 right-8 h-px w-20 rotate-[-18deg] bg-blue-200" />
      </div>
    );
  }

  if (theme === "finance") {
    return (
      <div className="h-full rounded bg-slate-50 p-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-2 w-14 rounded bg-blue-500" />
          <div className="h-2 w-10 rounded bg-emerald-300" />
        </div>
        <div className="grid h-14 grid-cols-5 items-end gap-1.5">
          {[35, 68, 44, 82, 57].map((height, index) => (
            <div
              key={index}
              className="rounded-t bg-gradient-to-t from-blue-600 to-cyan-300"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          <div className="h-3 rounded bg-blue-100" />
          <div className="h-3 rounded bg-cyan-100" />
          <div className="h-3 rounded bg-emerald-100" />
        </div>
      </div>
    );
  }

  if (theme === "analytics") {
    return (
      <div className="h-full rounded bg-slate-50 p-2">
        <div className="mb-2 flex justify-between">
          <div className="h-2 w-10 rounded bg-slate-200" />
          <div className="h-2 w-6 rounded bg-emerald-300" />
        </div>
        <div className="grid h-14 grid-cols-4 items-end gap-2">
          {[45, 70, 35, 82].map((height, index) => (
            <div
              key={index}
              className="rounded-t bg-blue-500"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-2 h-2 w-20 rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="h-full rounded bg-slate-50 p-2">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2 w-16 rounded bg-blue-500" />
        <div className="h-2 w-8 rounded bg-cyan-300" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[78, 64, 88, 70].map((value) => (
          <div key={value} className="rounded bg-white p-1 shadow-sm">
            <div className="mx-auto grid size-8 place-items-center rounded-full border-2 border-cyan-300 text-[5px] font-bold text-blue-600">
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="h-4 rounded bg-blue-100" />
        <div className="h-4 rounded bg-cyan-100" />
      </div>
    </div>
  );
}
