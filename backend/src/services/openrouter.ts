import { getAdminSettings } from './adminSettings';
import { makeSlug } from './postStore';
import type { PostInput } from '../types';

function numberEnv(key: string, fallback: number) {
  const parsed = Number(process.env[key]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function stripCodeFence(raw: string) {
  return raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
}

function parseJsonResponse(raw: string) {
  const cleaned = stripCodeFence(raw);
  try {
    return JSON.parse(cleaned);
  } catch {
    const objectStart = cleaned.indexOf('{');
    const objectEnd = cleaned.lastIndexOf('}');
    if (objectStart >= 0 && objectEnd > objectStart) {
      return JSON.parse(cleaned.slice(objectStart, objectEnd + 1));
    }

    const arrayStart = cleaned.indexOf('[');
    const arrayEnd = cleaned.lastIndexOf(']');
    if (arrayStart >= 0 && arrayEnd > arrayStart) {
      return JSON.parse(cleaned.slice(arrayStart, arrayEnd + 1));
    }

    throw new Error('OpenRouter returned non-JSON content. Try again or use a model that supports JSON output.');
  }
}

function normalizeArticle(input: any, index: number): PostInput {
  const title = String(input?.title || `Online income article ${index + 1}`).trim();
  const secondaryKeywords = Array.isArray(input?.secondaryKeywords) ? input.secondaryKeywords : [];
  const tags = Array.isArray(input?.tags) && input.tags.length > 0
    ? input.tags
    : [input?.primaryKeyword, ...secondaryKeywords].filter(Boolean);

  return {
    title,
    slug: input?.slug ? makeSlug(String(input.slug)) : makeSlug(title),
    excerpt: String(input?.excerpt || input?.metaDescription || '').trim() || 'A practical e-CashEngine guide to building ethical online income.',
    contentHtml: String(input?.contentHtml || input?.html || input?.content || '').trim(),
    tags: tags.map(String).slice(0, 10),
    seoTitle: input?.seoTitle ? String(input.seoTitle).slice(0, 80) : undefined,
    seoDescription: input?.seoDescription || input?.metaDescription ? String(input.seoDescription || input.metaDescription).slice(0, 180) : undefined,
  };
}

function fallbackArticles(): PostInput[] {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 12);
  return ['Affiliate Marketing', 'AI Side Hustles', 'Digital Products'].map((topic, index) => ({
    title: `${topic} playbook ${stamp}`,
    slug: `${makeSlug(topic)}-playbook-${stamp}-${index + 1}`,
    excerpt: 'A locally generated placeholder article. Configure OpenRouter to generate production content.',
    contentHtml:
      `<h2>Introduction</h2><p>This placeholder appears because OPENROUTER_API_KEY is not configured. Replace it by setting production AI credentials.</p><h2>Step-by-Step Guide</h2><p>Use this topic as a starting point for a practical, ethical online income article.</p><h2>About the Author</h2><p>Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities.</p>`,
    tags: [topic.toLowerCase(), 'online income'],
  }));
}

export async function generateArticlesWithOpenRouter(count = 3): Promise<PostInput[]> {
  const settings = await getAdminSettings();
  const articleCount = Math.min(3, Math.max(1, count));
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return fallbackArticles().slice(0, articleCount);
  }

  const prompt = settings.masterPrompt.slice(0, numberEnv('OPENROUTER_MAX_INPUT_CHARS', 8000));
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_SITE_URL || process.env.SITE_URL || 'http://localhost:3000',
      'X-Title': 'E-CashEngine',
    },
    signal: AbortSignal.timeout(numberEnv('OPENROUTER_TIMEOUT_MS', 45000)),
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct',
      max_tokens: numberEnv('OPENROUTER_MAX_OUTPUT_TOKENS', 9000),
      temperature: numberEnv('OPENROUTER_TEMPERATURE', 0.7),
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            `Return JSON only, with no prose before or after it. Shape: {"articles":[{"title":"...","slug":"...","seoTitle":"...","metaDescription":"...","primaryKeyword":"...","secondaryKeywords":["..."],"excerpt":"...","tags":["..."],"contentHtml":"..."}]}. Generate exactly ${articleCount} article${articleCount === 1 ? '' : 's'}. contentHtml must be full article HTML only, no markdown tables, no images, no financial guarantees.`,
        },
        { role: 'user', content: `${prompt}\n\nIMPORTANT: Generate exactly ${articleCount} article${articleCount === 1 ? '' : 's'} for this request. Your entire response must be valid JSON only. Do not write "Here are", explanations, markdown, or code fences.` },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenRouter request failed: ${response.status}`);
  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const parsed = parseJsonResponse(raw);
  const articles: unknown[] = Array.isArray(parsed) ? parsed : Array.isArray(parsed.articles) ? parsed.articles : [parsed];
  return articles.slice(0, articleCount).map(normalizeArticle).filter((article: PostInput) => article.contentHtml);
}
