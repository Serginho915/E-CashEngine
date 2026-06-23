'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Article } from '../types';
import ArticleCover from './ArticleCover';
import { apiUrl } from '../lib/siteConfig';

export default function HeaderSearch({ onSelect }: { onSelect?: () => void }) {
  const [query, setQuery] = React.useState('');
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isFocused, setIsFocused] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let active = true;

    fetch(apiUrl('/api/articles'))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (active && Array.isArray(payload?.data)) {
          setArticles(payload.data);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? articles
        .filter((article) => article.title.toLowerCase().includes(normalizedQuery))
        .slice(0, 5)
    : [];
  const isOpen = isFocused && normalizedQuery.length > 0;

  return (
    <div ref={searchRef} className="relative w-full md:w-[min(42vw,520px)]">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search articles"
          className="h-12 w-full rounded-full border border-stone-300 bg-[#fffdf8]/78 pl-12 pr-4 text-sm font-semibold text-stone-900 outline-none transition placeholder:text-stone-500 focus:border-stone-950 focus:bg-white focus:shadow-[0_16px_50px_rgba(28,25,23,.08)] dark:border-stone-800 dark:bg-stone-950/62 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-500 dark:focus:bg-stone-950"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-[80] overflow-hidden rounded-2xl border border-stone-300 bg-[#fffdf8] shadow-2xl shadow-stone-950/12 dark:border-stone-800 dark:bg-stone-950">
          {results.length > 0 ? (
            <div className="max-h-[420px] overflow-y-auto p-2">
              {results.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  onClick={() => {
                    setIsFocused(false);
                    setQuery('');
                    onSelect?.();
                  }}
                  className="grid grid-cols-[72px_1fr] gap-3 rounded-xl p-2 transition hover:bg-stone-100 dark:hover:bg-stone-900"
                >
                  <div className="h-16 overflow-hidden rounded-md bg-stone-100 dark:bg-stone-900">
                    <ArticleCover article={article} compact />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-stone-950 dark:text-stone-50">
                      {article.title}
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs leading-5 text-stone-600 dark:text-stone-400">
                      {article.excerpt}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-sm font-medium text-stone-600 dark:text-stone-400">
              No articles found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
