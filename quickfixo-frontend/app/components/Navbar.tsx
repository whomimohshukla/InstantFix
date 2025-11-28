"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-primary-100/60 bg-cream-100/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: logo + brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700 text-cream-50 text-sm font-bold shadow-sm">
            QF
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[15px] font-semibold tracking-tight text-shell-900">
              QuickFixo
            </span>
            <span className="text-[12px] text-primary-400">Home fixes on demand</span>
          </div>
        </Link>

        {/* Center: location + search (desktop) */}
        <div className="hidden flex-1 items-center justify-center gap-3 md:flex">
          <button className="flex min-w-[200px] max-w-xs items-center gap-2 rounded-md border border-primary-100 bg-white px-3 py-2 text-[12px] text-primary-700 shadow-sm transition hover:border-primary-300 hover:bg-primary-50">
            <span className="text-[15px] text-primary-300">📍</span>
            <span className="flex flex-col leading-tight text-left">
              <span className="font-semibold text-primary-700">Select area</span>
              <span className="text-[11px] text-primary-400">e.g. HSR Layout</span>
            </span>
          </button>
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-md border border-primary-100 bg-white px-3 py-2 text-[13px] text-primary-700 shadow-sm">
            <span className="text-[15px] text-primary-300">🔍</span>
            <input
              className="w-full bg-transparent text-[13px] text-primary-700 outline-none placeholder:text-primary-300"
              placeholder="Search home services"
            />
          </div>
        </div>

        {/* Right: icons / mobile menu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-primary-100 bg-cream-50 text-[16px] text-primary-700 shadow-sm hover:border-primary-300 hover:bg-primary-50 md:flex"
            aria-label="View cart"
          >
            🛒
          </button>
          <button
            type="button"
            className="hidden h-8 w-8 items-center justify-center rounded-full border border-primary-100 bg-cream-50 text-[16px] text-primary-700 shadow-sm hover:border-primary-300 hover:bg-primary-50 md:flex"
            aria-label="Account"
          >
            👤
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-200 bg-cream-50 text-primary-700 shadow-sm md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="relative block h-4 w-4">
              <span
                className={`absolute inset-x-0 top-0 h-[2px] rounded-full bg-primary-700 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-primary-700 transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-primary-700 transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown: location + search */}
      {open && (
        <nav className="mx-auto mt-2 max-w-6xl px-4 pb-3 sm:px-6 lg:px-8 md:hidden">
          <div className="space-y-2 rounded-xl border border-primary-100 bg-cream-50 p-3 text-sm text-primary-700 shadow-sm">
            <button className="flex w-full items-center gap-2 rounded-md border border-primary-100 bg-white px-3 py-2 text-[12px] hover:border-primary-300 hover:bg-primary-50">
              <span className="text-[15px] text-primary-300">📍</span>
              <span className="truncate">Select area</span>
            </button>
            <div className="flex items-center gap-2 rounded-md border border-primary-100 bg-white px-3 py-2 text-[13px]">
              <span className="text-[15px] text-primary-300">🔍</span>
              <input
                className="w-full bg-transparent text-[13px] text-primary-700 outline-none placeholder:text-primary-300"
                placeholder="Search home services"
              />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
