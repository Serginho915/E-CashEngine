import React from 'react';
import { getSiteData } from '../../src/lib/data';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import ArticleCover from '../../src/components/ArticleCover';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage({ searchParams }: { searchParams?: Promise<{ tag?: string }> }) {
  const { latest } = await getSiteData();
  const params = searchParams ? await searchParams : {};
  const selectedTag = params.tag ? decodeURIComponent(params.tag) : '';
  const allTags = Array.from(new Set(latest.flatMap((article) => article.tags || []))).sort((a, b) => a.localeCompare(b));
  const filteredArticles = selectedTag
    ? latest.filter((article) => (article.tags || []).some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
    : latest;

  return (
    <div className="container mx-auto px-6 py-12 md:py-16">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-stone-950 md:text-6xl dark:text-stone-50">Online income guides</h1>
        <p className="max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">Practical, SEO-focused articles by Irina Vovk about ethical ways to make money online.</p>
      </div>

      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/articles"
            className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${selectedTag ? 'border-stone-300 bg-[#fffdf8]/70 text-stone-700 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-300' : 'border-stone-950 bg-stone-950 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950'}`}
          >
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/articles?tag=${encodeURIComponent(tag)}`}
              className={`rounded-full border px-3 py-1.5 text-sm font-bold transition ${selectedTag.toLowerCase() === tag.toLowerCase() ? 'border-stone-950 bg-stone-950 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950' : 'border-stone-300 bg-[#fffdf8]/70 text-stone-700 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-300 dark:hover:border-stone-500'}`}
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((a) => (
          <Link key={a.id} href={`/articles/${a.slug}`} className="group">
            <article className="h-full overflow-hidden rounded-xl border border-stone-300 bg-[#fffdf8]/80 backdrop-blur transition-all hover:-translate-y-1 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:hover:border-stone-500">
              <div className="relative h-48 overflow-hidden bg-stone-100 dark:bg-stone-900">
                <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
                  <ArticleCover article={a} compact />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                    {a.category}
                  </span>
                </div>
                <h3 className="mb-2 line-clamp-2 text-lg font-black text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-200">
                  {a.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{a.excerpt}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <Clock size={14} />
                  {a.readingTime} min read
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
