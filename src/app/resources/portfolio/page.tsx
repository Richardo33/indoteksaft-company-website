import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/shared/container";

export const metadata: Metadata = {
  title: "Portfolio Project",
  description: "Selected portfolio projects and implementation highlights.",
  alternates: {
    canonical: "/resources/portfolio",
  },
};

const portfolioProjects = [
  {
    title: "Security Appliance & Virtualization Solutions",
    client: "Mabes TNI AD | Pusansiad | Mabes TNI - Pusinfo | Mabes TNI AL",
    image: "/images/mabes-tni.png",
  },
  {
    title: "IT Architecture Solutions for Big Data Platforms",
    client: "PT Gudang Garam Tbk.",
    image: "/images/gudang-garam.png",
  },
  {
    title: "Network Infrastructure Solutions for Medical Centers",
    client:
      "RS Mata Cicendo | RSUD Bandung Kiwari | RSJ Provinsi Jabar | RSKGM Kota Bandung",
    image: "/images/RS-mata-Cicendo.png",
  },
  {
    title: "Tax Payment System Integration & Security Solutions",
    client: "Badan Pendapatan Daerah Provinsi Jawa Barat",
    image: "/images/BPD-Prov-Jabar.png",
  },
  {
    title: "Enterprise Firewall & Network Security Solutions",
    client: "PT Leetex Garment Indonesia",
    image: "/images/PT-Leetex.png",
  },
  {
    title: "Advanced Network Infrastructure for Airfield Operations",
    client: "Dinas Perhubungan Provinsi Jawa Barat (Dishub Jabar)",
    image: "/images/Dishub-Jabar.png",
  },
  {
    title: "Comprehensive IT Infrastructure Solutions",
    client: "Yayasan Taruna Bakti",
    image: "/images/Yayasan-Taruna-Bakti.png",
  },
  {
    title: "Hotel IT Infrastructure Solutions for High-Connectivity Environments",
    client: "PT Bethesda Hospital Indonesia",
    image: "/images/PT-Bethesda.png",
  },
  {
    title:
      "Managed High-Capacity Server Services & Production Monitoring for Healthcare Facilities",
    client: "Rumah Sakit Paru dr. H. A. Rotinsulu",
    image: "/images/RS-Paru.png",
  },
  {
    title: "Telecommunications Infrastructure Installation & Dismantling Services",
    client: "PT Telekomunikasi Selular (Telkomsel)",
    image: "/images/PT-Telkomsel.png",
  },
] as const;

export default function PortfolioResourcePage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="bg-[#0d2f86] pt-18 text-white">
        <Container className="py-14 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">
            Portfolio Project
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-cyan-200 sm:text-4xl">
            Project Experience
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
            From infrastructure modernization to intelligent digital solutions,
            our projects reflect a commitment to innovation, reliability, and
            measurable impact.
          </p>
        </Container>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {portfolioProjects.map((project) => (
              <article key={project.title} className="flex h-full flex-col bg-white shadow-sm">
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5 pb-4">
                  <h2 className="line-clamp-3 min-h-[72px] text-sm font-bold leading-6 text-slate-950">
                    {project.title}
                  </h2>
                  <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-blue-600">
                    Client
                  </p>
                  <p className="mt-1 line-clamp-2 min-h-10 text-xs uppercase leading-5 text-slate-500">
                    {project.client}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
