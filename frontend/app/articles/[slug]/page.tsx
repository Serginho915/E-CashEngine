import React from 'react';
import { getArticleBySlug } from '../../../src/lib/data';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import ArticleCover from '../../../src/components/ArticleCover';
import ShareButtons from '../../../src/components/ShareButtons';
import { Article } from '../../../src/types';
import { removeInlineAboutAuthor } from '../../../src/lib/articleContent';
import { siteConfig } from '../../../src/lib/siteConfig';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { article, author } = await getArticleBySlug(slug);
  const title = article.seoTitle || article.title;
  const description = article.metaDescription || article.excerpt;
  const imageUrl = article.cover?.startsWith('/generated/')
    ? `${process.env.NEXT_PUBLIC_API_URL || ''}${article.cover}`
    : article.cover || '/logo.png';

  return {
    title,
    description,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    authors: [{ name: author.name, url: `${siteConfig.siteUrl}/authors/${author.id}` }],
    keywords: [article.primaryKeyword, ...(article.secondaryKeywords || []), ...(article.tags || [])].filter(Boolean),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/articles/${article.slug}`,
      publishedTime: article.createdAt,
      authors: [author.name],
      tags: article.tags,
      images: [
        {
          url: imageUrl,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

function getRelatedArticles(article: Article, articles: Article[]) {
  const currentTags = new Set((article.tags || []).map((tag) => tag.toLowerCase()));

  return articles
    .filter((item) => item.slug !== article.slug)
    .map((item) => {
      const sharedTags = (item.tags || []).filter((tag) => currentTags.has(tag.toLowerCase())).length;
      const sameCategory = item.category && article.category && item.category.toLowerCase() === article.category.toLowerCase() ? 1 : 0;

      return {
        item,
        score: sharedTags * 3 + sameCategory,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { article, author, articles } = await getArticleBySlug(slug);
  const relatedArticles = getRelatedArticles(article, articles);

  return (
    <article
      className="min-h-screen"
    >
      {/* Hero image */}
      <div className="h-96 w-full overflow-hidden bg-stone-100 md:h-[500px] dark:bg-stone-900">
        <ArticleCover article={article} />
      </div>

      {/* Article content */}
      <div className="w-full px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                {article.category}
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-stone-950 md:text-5xl dark:text-stone-50">{article.title}</h1>
            <p className="mb-6 text-xl leading-8 text-stone-600 dark:text-stone-400">{article.excerpt}</p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 border-b border-stone-300 pb-6 text-sm text-stone-600 dark:border-stone-800 dark:text-stone-400">
              <div className="flex items-center gap-3">
                <Link href={`/authors/${author.id}`}>
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                <div>
                  <Link href={`/authors/${author.id}`} className="font-semibold text-stone-900 hover:text-stone-600 dark:text-stone-100">
                    {author.name}
                  </Link>
                  <div className="text-xs">{new Date(article.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                {article.readingTime} min read
              </div>
            </div>
            {article.tags && article.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-stone-300 bg-[#fffdf8]/70 px-3 py-1 text-xs font-bold text-stone-700 transition hover:border-stone-950 hover:text-stone-950 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:text-white"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Main content */}
          <div
            className="article-content py-10"
          >
            <div dangerouslySetInnerHTML={{ __html: removeInlineAboutAuthor(article.content) }} />
          </div>

          {/* Share */}
          <div
            className="mt-8 border-t border-stone-300 pt-8 dark:border-stone-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-3 font-semibold">Share this income guide</h3>
                <ShareButtons title={article.title} slug={article.slug} />
              </div>
            </div>
          </div>

          {/* Author card */}
          <div
            className="mt-12 rounded-xl border border-stone-300 bg-[#fffdf8]/78 p-6 dark:border-stone-800 dark:bg-stone-950/60"
          >
            <h3 className="font-semibold mb-4">About the author</h3>
            <Link href={`/authors/${author.id}`} className="flex items-center gap-4 hover:opacity-80 transition">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-bold text-stone-950 hover:text-stone-700 dark:text-stone-50">{author.name}</h4>
                <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">{author.bio}</p>
              </div>
            </Link>
          </div>

          {relatedArticles.length > 0 && (
            <section className="mt-12 border-t border-stone-300 pt-10 dark:border-stone-800">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight text-stone-950 dark:text-stone-50">Related income guides</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                  More articles connected by topic, category, and tags.
                </p>
              </div>
              <div className="-mx-6 overflow-x-auto px-6 pb-3 [scrollbar-width:thin]">
                <div className="flex gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-stone-300 bg-[#fffdf8]/78 transition hover:-translate-y-0.5 hover:border-stone-950 sm:w-[320px] dark:border-stone-800 dark:bg-stone-950/60 dark:hover:border-stone-500"
                  >
                    <div className="h-40 overflow-hidden bg-stone-100 dark:bg-stone-900">
                      <ArticleCover article={related} compact />
                    </div>
                    <div className="flex min-h-[220px] flex-1 flex-col justify-between gap-4 p-4">
                      <div>
                        <div className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
                          {related.category}
                        </div>
                        <h3 className="text-lg font-black leading-tight text-stone-950 transition group-hover:text-stone-700 dark:text-stone-50 dark:group-hover:text-stone-200">
                          {related.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                          {related.excerpt}
                        </p>
                      </div>
                      {related.tags && related.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {related.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600 dark:bg-stone-900 dark:text-stone-300">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                </div>
              </div>
            </section>
          )}

          {/* Back to articles */}
          <div
            className="mt-12 text-center"
          >
            <Link href="/articles" className="inline-flex items-center gap-2 font-medium text-stone-800 hover:text-stone-950 dark:text-stone-200 dark:hover:text-white">
              ← Back to income guides
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
