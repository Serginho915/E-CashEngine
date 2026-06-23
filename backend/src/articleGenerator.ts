import fs from 'fs/promises';
import path from 'path';
import { sendArticleNewsletter } from './newsletter';

export type Author = {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  links?: { website?: string };
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover?: string;
  authorId: string;
  createdAt: string;
  readingTime?: number;
  category?: string;
  views?: number;
  tags?: string[];
  imagePrompt?: string;
  seoTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
};

type GenerationState = {
  lastGeneratedDate?: string;
  generatedSlots?: Record<string, string[]>;
};

const dataDir = process.env.ARTICLES_DATA_DIR || path.join(process.cwd(), 'data');
const articlesFile = path.join(dataDir, 'articles.json');
const generationStateFile = path.join(dataDir, 'generation-state.json');
const generatedImagesDir = path.join(dataDir, 'images');
const scheduleTimeZone = 'Europe/Sofia';
const scheduledHours = [7, 13, 20];
const siteUrl = process.env.SITE_URL || 'https://e-cashengine.com';

export const authors: Author[] = [
  {
    id: 'irina-vovk',
    name: 'Irina Vovk',
    bio: 'Digital entrepreneur and online income researcher helping readers build practical, ethical, and scalable income streams.',
    avatar: '/avatars/ava.svg',
    followers: 18600,
    links: { website: siteUrl },
  },
];

const fallbackCovers = ['/covers/cover1.svg', '/covers/cover2.svg', '/covers/cover3.svg'];

export function getGeneratedImagesDir() {
  return generatedImagesDir;
}

function buildArticlePrompt(articleNumber: number, avoidTopics: string[]) {
  return `MASTER PROMPT FOR E-CASHENGINE
You are Irina Vovk, a professional online income expert, digital entrepreneur, and content creator writing for the blog "e-CashEngine" (${siteUrl}).
Create ONE high-quality blog article about a legitimate way to make money online.
This is article ${articleNumber} of 3 for today.

Cover different categories and keyword opportunities across affiliate marketing, blogging, freelancing, remote jobs, AI side hustles, print-on-demand, dropshipping, ecommerce, Amazon FBA, YouTube monetization, TikTok income strategies, social media management, SEO services, copywriting, digital products, online courses, cryptocurrency, passive income, website flipping, app development, email marketing, online consulting, virtual assistant services, online surveys, stock photography, online investing, and emerging online business opportunities.

Avoid these already used topics today: ${avoidTopics.length > 0 ? avoidTopics.join(', ') : 'none'}.

The article must be original, fluent American English, practical, motivational, ethical, data-driven, and written like an experienced entrepreneur. Avoid fluff and get-rich-quick claims.

Include:
- title
- seoTitle, max 60 characters
- slug
- metaDescription, 150-160 characters
- excerpt
- primaryKeyword
- 5-10 secondaryKeywords
- category
- tags
- readingTime
- imagePrompt for a premium editorial cover image. Describe a clean, modern, finance/business visual with no text, no logos, no people faces, and no get-rich-quick imagery.
- contentHtml

contentHtml must use only these tags: h2, h3, p, ul, ol, li, strong.
Structure contentHtml exactly with these sections:
Introduction
What Is [Topic]
Why This Opportunity Matters in 2026
Step-by-Step Guide
Common Mistakes to Avoid
Realistic Income Expectations
Best Tools and Resources
Success Story
Frequently Asked Questions with 5-8 questions and answers
Final Thoughts
About the Author

At the end include this exact About the Author text:
Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities.

Return ONLY valid JSON in this exact shape:
{
  "article": {
    "title": "string",
    "seoTitle": "string",
    "slug": "string",
    "metaDescription": "string",
    "excerpt": "string",
    "primaryKeyword": "string",
    "secondaryKeywords": ["string"],
    "category": "string",
    "tags": ["string"],
    "readingTime": 12,
    "imagePrompt": "string",
    "contentHtml": "string"
  }
}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function seededReaderCount(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return 1200 + (hash % 8800);
}

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/<(?!\/?(h2|h3|p|ul|ol|li|strong)\b)[^>]+>/gi, '');
}

function removeInlineAboutAuthor(html: string) {
  return html.replace(/<h2>\s*About the Author\s*<\/h2>\s*<p>[\s\S]*?<\/p>\s*$/i, '').trim();
}

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readArticles(): Promise<Article[]> {
  try {
    const raw = await fs.readFile(articlesFile, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((article) => ({
          ...article,
          views: article.views && article.views > 0 ? article.views : seededReaderCount(article.slug || article.title || article.id),
        }))
      : [];
  } catch (error) {
    return [];
  }
}

async function writeArticles(articles: Article[]) {
  await ensureDataDir();
  await fs.writeFile(articlesFile, JSON.stringify(articles, null, 2));
}

function normalizeArticle(input: any, index: number, existingSlugs: Set<string>): Article {
  const title = String(input.title || `Online Income Guide ${Date.now()} ${index + 1}`).trim();
  const baseSlug = slugify(String(input.slug || title)) || `online-income-guide-${Date.now()}-${index + 1}`;
  let slug = baseSlug;
  let suffix = 2;

  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  existingSlugs.add(slug);

  return {
    id: `ai-${Date.now()}-${index}`,
    title,
    slug,
    excerpt: String(input.excerpt || input.metaDescription || '').slice(0, 260),
    content: removeInlineAboutAuthor(sanitizeHtml(String(input.contentHtml || input.content || ''))),
    cover: fallbackCovers[index % fallbackCovers.length],
    authorId: 'irina-vovk',
    createdAt: new Date().toISOString(),
    readingTime: Number(input.readingTime) || 12,
    category: String(input.category || 'Online Income'),
    views: seededReaderCount(slug),
    tags: Array.isArray(input.tags) ? input.tags.map(String).slice(0, 8) : [],
    imagePrompt: String(input.imagePrompt || ''),
    seoTitle: String(input.seoTitle || title).slice(0, 60),
    metaDescription: String(input.metaDescription || input.excerpt || '').slice(0, 180),
    primaryKeyword: String(input.primaryKeyword || ''),
    secondaryKeywords: Array.isArray(input.secondaryKeywords) ? input.secondaryKeywords.map(String).slice(0, 10) : [],
  };
}

function extractJson(content: string) {
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error('OpenRouter response did not contain JSON.');
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}

async function listReusableImages() {
  try {
    const files = await fs.readdir(generatedImagesDir);
    return files
      .filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    return [];
  }
}

async function pickReusableCover(article: Article, index: number) {
  const images = await listReusableImages();

  if (images.length === 0) {
    return fallbackCovers[index % fallbackCovers.length];
  }

  const exactMatch = images.find((image) => image.replace(/\.(png|jpe?g|webp|avif)$/i, '') === article.slug);
  const selected = exactMatch || images[index % images.length];

  return `/generated/${selected}`;
}

function getSofiaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: scheduleTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const value = (type: string) => parts.find((part) => part.type === type)?.value || '';

  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    hour: Number(value('hour')),
    minute: Number(value('minute')),
  };
}

function getActiveScheduleSlot() {
  const now = getSofiaParts();

  if (!scheduledHours.includes(now.hour)) {
    return null;
  }

  return {
    date: now.date,
    hour: now.hour,
    slot: `${String(now.hour).padStart(2, '0')}:00`,
    articleNumber: scheduledHours.indexOf(now.hour) + 1,
  };
}

function getSofiaDateForIso(isoDate: string) {
  return getSofiaParts(new Date(isoDate)).date;
}

async function generateArticles(count: number, articleNumberStart = 1, initialAvoidTopics: string[] = []) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured.');
  }

  const existing = await readArticles();
  const slugs = new Set(existing.map((article) => article.slug));
  const generated: Article[] = [];
  const avoidTopics: string[] = [...initialAvoidTopics];

  for (let index = 0; index < count; index += 1) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': process.env.SITE_NAME || 'e-CashEngine',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You write production-ready SEO blog content and return strict JSON only.',
          },
          {
            role: 'user',
            content: buildArticlePrompt(articleNumberStart + index, avoidTopics),
          },
        ],
        temperature: 0.75,
        max_tokens: Number(process.env.OPENROUTER_MAX_TOKENS || 3500),
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`OpenRouter request failed: ${response.status} ${details}`);
    }

    const payload: any = await response.json();
    const content = payload?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenRouter response did not include message content.');
    }

    const parsed = extractJson(content);
    const rawArticle = parsed.article || (Array.isArray(parsed.articles) ? parsed.articles[0] : null);

    if (!rawArticle) {
      throw new Error('OpenRouter response did not include an article.');
    }

    const normalized = normalizeArticle(rawArticle, index, slugs);
    normalized.cover = await pickReusableCover(normalized, index);
    generated.push(normalized);
    avoidTopics.push(normalized.title);
  }

  const normalized = generated;
  const nextArticles = [...normalized, ...existing];

  await writeArticles(nextArticles);

  for (const article of normalized) {
    sendArticleNewsletter(article).catch((error) => {
      console.error('Newsletter send failed:', error);
    });
  }

  return normalized;
}

export async function generateDailyArticles() {
  const normalized = await generateArticles(3, 1);
  const today = getSofiaParts().date;
  const state = await readGenerationState();
  await saveGenerationState({
    ...state,
    lastGeneratedDate: today,
    generatedSlots: {
      ...(state.generatedSlots || {}),
      [today]: scheduledHours.map((hour) => `${String(hour).padStart(2, '0')}:00`),
    },
  });

  return normalized;
}

export async function assignReusableArticleImages() {
  const articles = await readArticles();
  const updatedArticles = await Promise.all(
    articles.map(async (article, index) => ({
      ...article,
      cover: article.cover?.startsWith('/generated/') ? article.cover : await pickReusableCover(article, index),
      views: article.views && article.views > 0 ? article.views : seededReaderCount(article.slug),
    })),
  );

  await writeArticles(updatedArticles);

  return updatedArticles.filter((article) => article.cover?.startsWith('/generated/'));
}

export async function readGenerationState(): Promise<GenerationState> {
  try {
    const raw = await fs.readFile(generationStateFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return {};
  }
}

async function saveGenerationState(state: GenerationState) {
  await ensureDataDir();
  await fs.writeFile(generationStateFile, JSON.stringify(state, null, 2));
}

export async function generateIfNeeded() {
  const activeSlot = getActiveScheduleSlot();

  if (!activeSlot) {
    return [];
  }

  const state = await readGenerationState();
  const generatedSlots = state.generatedSlots || {};
  const todaySlots = generatedSlots[activeSlot.date] || [];

  if (todaySlots.includes(activeSlot.slot)) {
    return [];
  }

  const existing = await readArticles();
  const todayTopics = existing
    .filter((article) => getSofiaDateForIso(article.createdAt) === activeSlot.date)
    .map((article) => article.title);
  const generated = await generateArticles(1, activeSlot.articleNumber, todayTopics);
  const nextSlots = [...todaySlots, activeSlot.slot].sort();

  await saveGenerationState({
    ...state,
    lastGeneratedDate: nextSlots.length >= scheduledHours.length ? activeSlot.date : state.lastGeneratedDate,
    generatedSlots: {
      ...generatedSlots,
      [activeSlot.date]: nextSlots,
    },
  });

  return generated;
}

export function startDailyArticleScheduler() {
  if (process.env.AUTO_GENERATE_ARTICLES !== 'true') {
    return;
  }

  setTimeout(() => {
    generateIfNeeded().catch((error) => {
      console.error('Daily article generation failed:', error);
    });
  }, 10_000);

  setInterval(() => {
    generateIfNeeded().catch((error) => {
      console.error('Daily article generation failed:', error);
    });
  }, 5 * 60 * 1000);
}
