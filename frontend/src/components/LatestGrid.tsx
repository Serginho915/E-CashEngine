'use client';

import React from 'react';
import { Article } from '../types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Eye } from 'lucide-react';
import ArticleCover from './ArticleCover';

export default function LatestGrid({ items }: { items: Article[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((a) => (
        <motion.div key={a.id} variants={item}>
          <Link href={`/articles/${a.slug}`} className="block h-full">
            <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone-300/80 bg-[#fffdf8]/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:hover:border-stone-500">
              {/* Image container */}
              <div className="relative h-52 overflow-hidden bg-stone-100 dark:bg-stone-900">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <ArticleCover article={a} compact />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                {/* Category badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                    {a.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-3 line-clamp-2 text-xl font-black leading-tight text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-200">
                  {a.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-6 line-clamp-3 flex-grow text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {a.excerpt}
                </p>

                {/* Meta footer */}
                <div className="flex items-center justify-between border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {a.readingTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      {(a.views || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
