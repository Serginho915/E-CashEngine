import { MetadataRoute } from 'next';
import { getSiteData } from '../src/lib/data';
import { siteConfig } from '../src/lib/siteConfig';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { latest, authors } = await getSiteData();
  const now = new Date();

  return [
    {
      url: siteConfig.siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.siteUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.siteUrl}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...latest.map((article) => ({
      url: `${siteConfig.siteUrl}/articles/${article.slug}`,
      lastModified: new Date(article.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...authors.map((author) => ({
      url: `${siteConfig.siteUrl}/authors/${author.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
