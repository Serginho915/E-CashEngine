'use client';

import React from 'react';
import { Author } from '../types';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedAuthors({ authors }: { authors: Author[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial={false}
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-8"
    >
      {authors.map((a) => (
        <motion.div key={a.id} variants={item}>
          <Link href={`/authors/${a.id}`} className="block h-full">
            <div className="group relative h-full overflow-hidden rounded-xl border border-stone-300/80 bg-[#fffdf8]/78 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/58 dark:hover:border-stone-500">
              <div className="relative z-10">
                {/* Avatar */}
                <div className="mb-5">
                  <div className="relative w-20 h-20 mx-auto">
                    <img
                      src={a.avatar}
                      alt={a.name}
                      className="h-full w-full rounded-xl border border-stone-300 object-cover transition-all group-hover:border-amber-300 dark:border-stone-800"
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className="mb-2 text-center text-lg font-black text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-200">
                  {a.name}
                </h3>

                {/* Bio */}
                <p className="mb-5 line-clamp-2 text-center text-sm leading-6 text-stone-600 dark:text-stone-400">
                  {a.bio}
                </p>

                {/* Stats */}
                <div className="mb-5 flex items-center justify-center gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/70">
                  <Users size={16} className="text-amber-700 dark:text-amber-300" />
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {(a.followers || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-stone-600 dark:text-stone-400">readers</span>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-stone-800 transition-all group-hover:gap-3 dark:text-stone-200">
                  About Irina
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
