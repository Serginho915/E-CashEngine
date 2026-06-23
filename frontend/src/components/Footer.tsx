'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-stone-300 bg-[#f1ece3] dark:border-stone-800 dark:bg-[#11100e]">
      <div className="container mx-auto flex flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <img
            src="/logo.png"
            alt="e-CashEngine"
            className="h-14 w-14 object-contain"
          />
        </Link>

        <div className="flex flex-col gap-2 text-sm text-stone-600 sm:items-end dark:text-stone-400">
          <span>© {currentYear} e-CashEngine. All rights reserved.</span>
          <Link href="/cookies" className="font-semibold text-stone-800 transition hover:text-stone-950 dark:text-stone-200 dark:hover:text-white">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
