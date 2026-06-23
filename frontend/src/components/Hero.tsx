'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Article } from '../types';
import ArticleCover from './ArticleCover';

export default function Hero({ article }: { article: Article }) {
  return (
    <section className="relative">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px]">
        <motion.div
          className="min-w-0 space-y-8"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex"
          >
            <div className="flex items-center gap-2 rounded-full border border-stone-300 bg-[#fffdf8]/70 px-4 py-2 backdrop-blur dark:border-stone-700 dark:bg-stone-950/50">
              <Sparkles size={16} className="text-amber-700 dark:text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-300">Daily income guide</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
          >
            <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-stone-950 md:text-7xl lg:text-8xl dark:text-stone-50">
              {article.title}
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            className="max-w-2xl text-lg leading-8 text-stone-700 md:text-xl dark:text-stone-300"
          >
            {article.excerpt}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex flex-wrap gap-3"
          >
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center gap-3 rounded-lg bg-stone-950 px-6 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-amber-200 dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-white dark:focus:ring-amber-900"
              >
                Read the income plan
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex gap-8 border-t border-stone-300 pt-5 dark:border-stone-800"
          >
            <div>
              <div className="text-3xl font-black text-stone-950 dark:text-stone-50">{article.readingTime}</div>
              <div className="text-sm text-stone-600 dark:text-stone-400">min read</div>
            </div>
            <div>
              <div className="text-3xl font-black text-amber-700 dark:text-amber-300">{article.views?.toLocaleString()}</div>
              <div className="text-sm text-stone-600 dark:text-stone-400">readers</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="min-w-0"
        >
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-stone-300 bg-[#fffdf8]/72 p-4 backdrop-blur dark:border-stone-800 dark:bg-stone-950/55">
              <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-950 dark:border-stone-800">
                <ArticleCover article={article} className="h-56" compact />
              </div>
              <div className="space-y-5 p-3 pt-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
                  <span>{article.category}</span>
                  <span>{article.readingTime} min</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black leading-tight text-stone-950 dark:text-stone-50">{article.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-400">{article.excerpt}</p>
                </div>
                <div className="flex items-center gap-2 border-t border-stone-200 pt-4 text-sm font-semibold text-stone-800 dark:border-stone-800 dark:text-stone-200">
                  <BookOpen size={16} />
                  Written by Irina Vovk for ethical online earners
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
