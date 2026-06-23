import React from 'react';

export default function CreatePage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-16">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl dark:text-stone-50">Create e-CashEngine article</h1>
        <p className="mt-3 text-lg leading-8 text-stone-600 dark:text-stone-400">Draft a practical online income guide using Irina Vovk's daily article structure.</p>
      </div>
      <div className="mt-8 max-w-3xl rounded-2xl border border-stone-300 bg-[#fffdf8]/78 p-6 backdrop-blur dark:border-stone-800 dark:bg-stone-950/60">
        <label className="block text-sm font-bold uppercase tracking-[0.14em] text-stone-600 dark:text-stone-400">SEO title</label>
        <input className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-stone-400" />
        <label className="mt-5 block text-sm font-bold uppercase tracking-[0.14em] text-stone-600 dark:text-stone-400">Article draft</label>
        <textarea className="mt-2 h-64 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition focus:border-stone-950 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-stone-400" />
      </div>
    </div>
  );
}
