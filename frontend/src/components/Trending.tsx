'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Flame } from 'lucide-react';
import { Article } from '../types';

export default function Trending({ items }: { items: Article[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial={false}
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {items.map((it, i) => (
        <motion.div key={it.id} variants={item}>
          <Link href={`/articles/${it.slug}`} className="block h-full">
            <div className="group relative h-full overflow-hidden rounded-xl border border-stone-300/80 bg-[#fffdf8]/78 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/58 dark:hover:border-stone-500">
              <div className="relative z-10">
                {/* Icon and ranking */}
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-lg border border-stone-300 bg-stone-100 p-2.5 transition-all group-hover:border-amber-300 group-hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-900 dark:group-hover:border-amber-900/70 dark:group-hover:bg-amber-950/30">
                    {i === 0 ? (
                      <Flame size={20} className="text-amber-700 dark:text-amber-300" />
                    ) : (
                      <TrendingUp size={20} className="text-teal-700 dark:text-teal-300" />
                    )}
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600 dark:bg-stone-900 dark:text-stone-300">#{i + 1}</span>
                </div>

                {/* Title */}
                <h3 className="mb-3 line-clamp-2 text-lg font-black leading-snug text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-200">
                  {it.title}
                </h3>

                {/* Description */}
                <p className="mb-5 line-clamp-3 text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {it.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-500">
                  <span className="rounded bg-stone-100 px-2 py-1 font-medium text-stone-600 dark:bg-stone-900 dark:text-stone-300">{it.category}</span>
                  <span>{it.readingTime} min</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
