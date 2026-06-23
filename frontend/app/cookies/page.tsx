import React from 'react';

export default function CookiesPage() {
  return (
    <main className="container mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-black tracking-tight text-stone-950 dark:text-stone-50">Cookie Policy</h1>
      <p className="mt-5 leading-8 text-stone-600 dark:text-stone-400">
        e-CashEngine may use cookies or similar technologies to understand site performance and improve content. You can manage cookies in your browser settings.
      </p>
      <section className="mt-10 space-y-6 rounded-2xl border border-stone-300 bg-[#fffdf8]/78 p-6 dark:border-stone-800 dark:bg-stone-950/60">
        <div>
          <h2 className="text-xl font-black text-stone-950 dark:text-stone-50">Essential cookies</h2>
          <p className="mt-2 leading-7 text-stone-600 dark:text-stone-400">
            Required for basic site functionality, security, and remembering your cookie preference.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-950 dark:text-stone-50">Analytics cookies</h2>
          <p className="mt-2 leading-7 text-stone-600 dark:text-stone-400">
            Optional anonymous analytics may help us understand which online income guides are most useful to readers.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-950 dark:text-stone-50">Managing cookies</h2>
          <p className="mt-2 leading-7 text-stone-600 dark:text-stone-400">
            Use the small cookie menu at the bottom of the site, or clear browser storage for this domain to reset your preference.
          </p>
        </div>
      </section>
    </main>
  );
}
