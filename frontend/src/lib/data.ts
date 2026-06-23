import { Article, Author } from '../types';
import { getMockData } from './mockData';
import { apiUrl } from './siteConfig';

type SiteData = {
  featured: Article;
  trending: Article[];
  latest: Article[];
  authors: Author[];
};

async function fetchJson<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(apiUrl(path, true), {
      next: { revalidate: 300 },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return payload.data as T;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getSiteData(): Promise<SiteData> {
  const fallback = getMockData();
  const [articles, authors] = await Promise.all([
    fetchJson<Article[]>('/api/articles'),
    fetchJson<Author[]>('/api/authors'),
  ]);

  const latest = articles && articles.length > 0 ? articles : fallback.latest;
  const siteAuthors = authors && authors.length > 0 ? authors : fallback.authors;

  return {
    featured: latest[0] || fallback.featured,
    trending: latest.slice(0, 4),
    latest,
    authors: siteAuthors,
  };
}

export async function getArticleBySlug(slug: string) {
  const data = await getSiteData();
  const article = (await fetchJson<Article>(`/api/articles/${slug}`)) || data.latest.find((item) => item.slug === slug) || data.featured;
  const author = data.authors.find((item) => item.id === article.authorId) || data.authors[0];

  return { article, author, articles: data.latest, authors: data.authors };
}
