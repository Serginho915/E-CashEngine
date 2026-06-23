'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b border-stone-300/70 bg-[#fbfaf7]/92 backdrop-blur-xl dark:border-stone-800/80 dark:bg-[#11100e]/90"
    >
      <div className="container mx-auto grid min-h-[88px] grid-cols-[auto_1fr_auto] items-center gap-5 px-6 py-3">
        <Link
          href="/"
          className="group inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-stone-300/80 bg-[#fffdf8]/70 transition hover:-translate-y-0.5 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:hover:border-stone-500"
          aria-label="e-CashEngine home"
        >
          <img
            src="/logo.png"
            alt="e-CashEngine"
            className="h-14 w-14 object-contain"
          />
        </Link>

        <div className="hidden justify-self-center md:block">
          <HeaderSearch />
        </div>

        <nav className="hidden items-center justify-self-end md:flex">
          <Link
            href="/articles"
            className="rounded-full border border-stone-300 bg-[#fffdf8]/70 px-4 py-2 text-sm font-black text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-950 hover:bg-white dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-200 dark:hover:border-stone-500 dark:hover:bg-stone-900"
          >
            All articles
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="justify-self-end rounded-xl border border-stone-300 bg-[#fffdf8]/70 p-2.5 text-stone-800 transition hover:border-stone-950 hover:bg-white md:hidden dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-200 dark:hover:border-stone-500"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="border-t border-stone-200 bg-[#fbfaf7] md:hidden dark:border-stone-800 dark:bg-[#11100e]"
        >
          <div className="container mx-auto flex flex-col gap-3 px-6 py-4">
            <HeaderSearch onSelect={() => setIsOpen(false)} />
            <Link
              href="/articles"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-stone-300 bg-[#fffdf8]/70 px-4 py-3 text-center text-sm font-black text-stone-800 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-200"
            >
              All articles
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
