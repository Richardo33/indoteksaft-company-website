"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import type { NavItem } from "@/types/company";

type MobileNavigationProps = {
  items: readonly NavItem[];
};

export function MobileNavigation({ items }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="grid size-10 place-items-center rounded-lg border border-white/10 text-white transition hover:bg-white/5"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>

      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi mobile"
          className="absolute inset-x-5 top-[4.75rem] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-blue-500/10 hover:text-cyan-300"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <span className="block rounded-xl px-4 py-3 text-sm font-medium uppercase text-slate-400">
            English
          </span>
          <a
            href="#contact"
            className="mt-2 block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            Contact Sales
          </a>
        </nav>
      )}
    </div>
  );
}
