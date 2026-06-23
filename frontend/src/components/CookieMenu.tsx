'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings2, X } from 'lucide-react';

const STORAGE_KEY = 'ecashengine-cookie-choice';

export default function CookieMenu() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const saveChoice = (choice: string) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-xl border border-stone-300 bg-[#fffdf8] p-3 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="font-black text-stone-950 dark:text-stone-50">Cookie preferences</div>
          <p className="mt-1 leading-6">
            We use essential cookies and optional analytics to improve e-CashEngine.
            {' '}
            <Link href="/cookies" className="font-semibold text-stone-950 underline underline-offset-4 dark:text-white">Read policy</Link>
          </p>
          {expanded && (
            <div className="mt-3 grid gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs dark:border-stone-800 dark:bg-stone-900">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked readOnly />
                Essential cookies
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Anonymous analytics
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <button onClick={() => setExpanded((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-3 py-2 font-semibold transition hover:border-stone-950 dark:border-stone-700 dark:hover:border-stone-400">
            <Settings2 size={15} />
            Settings
          </button>
          <button onClick={() => saveChoice('essential')} className="rounded-lg border border-stone-300 px-3 py-2 font-semibold transition hover:border-stone-950 dark:border-stone-700 dark:hover:border-stone-400">
            Essential
          </button>
          <button onClick={() => saveChoice('accepted')} className="rounded-lg bg-stone-950 px-3 py-2 font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white">
            Accept
          </button>
          <button onClick={() => setVisible(false)} aria-label="Close cookie menu" className="rounded-lg p-2 transition hover:bg-stone-100 dark:hover:bg-stone-900">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
