import React from 'react';
import { getSiteData } from '../../../src/lib/data';
import { Users, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import ArticleCover from '../../../src/components/ArticleCover';

export const dynamic = 'force-dynamic';

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authors, latest } = await getSiteData();
  const author = authors.find((a) => a.id === id) || authors[0];
  const articles = latest.filter((l) => l.authorId === author.id);

  return (
    <div
      className="container mx-auto px-6 py-12"
    >
      {/* Author header */}
      <div
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <img
          src={author.avatar}
          alt={author.name}
          className="mx-auto mb-6 h-32 w-32 rounded-full border-4 border-stone-300 object-cover dark:border-stone-800"
        />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{author.name}</h1>
        <p className="mb-6 text-lg leading-8 text-stone-600 dark:text-stone-400">{author.bio}</p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-black text-stone-950 dark:text-stone-50">
              {articles.length}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Articles</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-700 dark:text-amber-300">
              <Users size={20} />
              {(author.followers || 0).toLocaleString()}
            </div>
            <div className="text-sm text-stone-600 dark:text-stone-400">Readers</div>
          </div>
        </div>

        {/* Social links */}
        {author.links && (
          <div className="flex items-center justify-center gap-3 mt-6">
            {author.links.twitter && (
              <a
                href={author.links.twitter}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 transition hover:border-stone-950 dark:border-stone-800 dark:hover:border-stone-500"
              >
                <LinkIcon size={16} />
                Twitter
              </a>
            )}
            {author.links.website && (
              <a
                href={author.links.website}
                className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 transition hover:border-stone-950 dark:border-stone-800 dark:hover:border-stone-500"
              >
                <LinkIcon size={16} />
                Website
              </a>
            )}
          </div>
        )}
      </div>

      {/* Articles section */}
      <section
      >
        <h2 className="text-3xl font-bold mb-8">Published income guides</h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group">
                <article className="h-full overflow-hidden rounded-xl border border-stone-300 bg-[#fffdf8]/80 transition-all hover:-translate-y-1 hover:border-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:hover:border-stone-500">
                  <div className="relative h-48 overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
                      <ArticleCover article={a} compact />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 line-clamp-2 text-lg font-black text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50">
                      {a.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-400">{a.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-stone-600 dark:text-stone-400">No articles published yet</p>
          </div>
        )}
      </section>

      {/* Back link */}
      <div
        className="mt-12 text-center"
      >
        <Link href="/articles" className="inline-flex items-center gap-2 font-medium text-stone-800 hover:text-stone-950 dark:text-stone-200 dark:hover:text-white">
          ← Back to income guides
        </Link>
      </div>
    </div>
  );
}
