import React from 'react';
import Hero from '../src/components/Hero';
import Trending from '../src/components/Trending';
import LatestGrid from '../src/components/LatestGrid';
import FeaturedAuthors from '../src/components/FeaturedAuthors';
import Newsletter from '../src/components/Newsletter';
import { getSiteData } from '../src/lib/data';
import { BookOpen, Flame, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { featured, trending, latest, authors } = await getSiteData();

  return (
    <div className="container mx-auto flex flex-col gap-20 px-6 py-12 md:gap-24 md:py-20">
      {/* Hero Section */}
      <Hero article={featured} />

      {/* Trending Section */}
      <section className="flex flex-col gap-12">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-900/50 dark:bg-amber-950/30">
              <Flame size={24} className="text-amber-700 dark:text-amber-300" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-stone-950 md:text-4xl dark:text-stone-50">Trending income guides</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
            Practical online income opportunities readers are researching right now.
          </p>
        </div>
        <Trending items={trending} />
      </section>

      {/* Latest Section */}
      <section className="flex flex-col gap-12">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-2 dark:border-teal-900/50 dark:bg-teal-950/30">
              <BookOpen size={24} className="text-teal-700 dark:text-teal-300" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-stone-950 md:text-4xl dark:text-stone-50">Latest money-making articles</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
            Three daily guides covering affiliate marketing, AI side hustles, freelancing, ecommerce, passive income, and more.
          </p>
        </div>
        <LatestGrid items={latest} />
      </section>

      {/* Featured Authors Section */}
      <section className="flex flex-col gap-12">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg border border-stone-300 bg-stone-100 p-2 dark:border-stone-800 dark:bg-stone-900">
              <Users size={24} className="text-stone-800 dark:text-stone-200" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-stone-950 md:text-4xl dark:text-stone-50">About the author</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
            Every guide is written from Irina Vovk's perspective: practical, ethical, realistic, and focused on long-term financial freedom.
          </p>
        </div>
        <FeaturedAuthors authors={authors} />
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  );
}
