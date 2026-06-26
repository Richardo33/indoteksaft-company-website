"use client";

import Image from "next/image";
import {
  CloudCog,
  Code2,
  Database,
  MonitorCog,
  RadioTower,
  ServerCog,
} from "lucide-react";
import { useEffect, useState } from "react";

import { solutionTabs, type SolutionTabId } from "@/config/solutions";

const tabIcons = {
  infrastructure: ServerCog,
  delivery: Code2,
  telecommunication: RadioTower,
} satisfies Record<SolutionTabId, React.ComponentType<{ size?: number; className?: string }>>;

const capabilityIcons = [CloudCog, ServerCog, Database, MonitorCog] as const;

export function SolutionsTabs() {
  const [activeId, setActiveId] = useState<SolutionTabId>("infrastructure");
  const activeSolution =
    solutionTabs.find((solution) => solution.id === activeId) ?? solutionTabs[0];
  const HeroIcon = tabIcons[activeSolution.id];

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      const selectedTab = solutionTabs.find((solution) => solution.id === hash);

      if (selectedTab) {
        setActiveId(selectedTab.id);
      }
    };

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);

    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  const handleTabChange = (id: SolutionTabId) => {
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="mt-12">
      <div
        role="tablist"
        aria-label="Solution categories"
        className="grid border border-slate-200 bg-white md:grid-cols-[1fr_1fr_1fr_2.6fr]"
      >
        {solutionTabs.map((solution) => {
          const Icon = tabIcons[solution.id];
          const selected = solution.id === activeSolution.id;

          return (
            <button
              key={solution.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="solutions-panel"
              className={`flex min-h-16 items-center gap-3 border-b border-slate-200 px-6 text-left text-sm font-bold transition md:border-b-0 md:border-r ${
                selected
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-400 hover:bg-slate-50 hover:text-blue-600"
              }`}
              onClick={() => handleTabChange(solution.id)}
            >
              <Icon aria-hidden="true" size={20} />
              {solution.label}
            </button>
          );
        })}
        <div aria-hidden="true" className="hidden md:block" />
      </div>

      <article id="solutions-panel" role="tabpanel" className="mt-4">
        <div className="grid min-h-[360px] overflow-hidden border-x border-slate-200 bg-cyan-50 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10">
            <div className="grid size-14 place-items-center bg-[#0d2f86] text-white">
              <HeroIcon aria-hidden="true" size={24} />
            </div>
            <h2 className="mt-8 text-3xl font-bold tracking-[-0.04em] text-slate-950">
              {activeSolution.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
              {activeSolution.description}
            </p>
          </div>

          <div className="relative min-h-[300px]">
            <Image
              key={activeSolution.image}
              src={activeSolution.image}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-cyan-50/20 to-transparent lg:from-cyan-50/70" />
          </div>
        </div>

        <div className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-8 py-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-blue-600">
              Core Capabilities
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {activeSolution.capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];

              return (
                <div
                  key={capability.title}
                  className="min-h-[190px] border-b border-slate-200 p-8 md:border-r lg:[&:nth-child(3n)]:border-r-0"
                >
                  <Icon aria-hidden="true" className="text-blue-600" size={22} />
                  <h4 className="mt-6 text-base font-bold text-slate-950">
                    {capability.title}
                  </h4>
                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
