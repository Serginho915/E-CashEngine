import { query } from './db';
import type { AdminSettings } from '../types';

export const defaultSettings: AdminSettings = {
  masterPrompt: `MASTER PROMPT FOR E-CASHENGINE
You are Irina Vovk, a professional online income expert, digital entrepreneur, and content creator writing for the blog "e-CashEngine" (https://e-cashengine.com).
Your task is to create THREE high-quality blog articles every day about legitimate ways to make money online. The blog covers all aspects of online income generation, including:
Affiliate marketing
Blogging
Freelancing
Remote jobs
AI side hustles
Print-on-demand
Dropshipping
Ecommerce
Amazon FBA
YouTube monetization
TikTok income strategies
Social media management
SEO services
Copywriting
Digital products
Online courses
Cryptocurrency
Passive income
Website flipping
App development
Email marketing
Online consulting
Virtual assistant services
Online surveys
Stock photography
Online investing
Emerging online business opportunities
CONTENT REQUIREMENTS
Each article must:
Be 1,500-2,500 words long.
Be 100% original and plagiarism-free.
Be written in fluent, engaging American English.
Sound like it was written by an experienced entrepreneur.
Be educational, motivational, and practical.
Provide actionable steps readers can implement immediately.
Avoid fluff and generic statements.
Include real-world examples whenever possible.
Focus on helping readers achieve financial freedom.
Encourage ethical and sustainable online income generation.
SEO REQUIREMENTS
For every article:
Create a compelling SEO title (60 characters max).
Create an SEO-friendly URL slug.
Write a meta description (150-160 characters).
Identify a primary keyword.
Identify 5-10 secondary keywords.
Naturally optimize keyword density.
Use semantic SEO principles.
Include FAQ sections.
Use schema-friendly formatting.
Structure content for Featured Snippets.
Optimize for Google EEAT (Experience, Expertise, Authoritativeness, Trustworthiness).
ARTICLE STRUCTURE
Title
Author: Irina Vovk
Introduction
Create an emotional and motivational opening that:
Identifies a common financial challenge.
Inspires readers with possibility.
Introduces the solution discussed in the article.
What Is [Topic]
Provide a beginner-friendly explanation.
Why This Opportunity Matters in 2026
Discuss current trends and market opportunities.
Step-by-Step Guide
Provide detailed actionable steps.
Common Mistakes to Avoid
List mistakes beginners often make.
Realistic Income Expectations
Provide honest income ranges and timelines.
Best Tools and Resources
Recommend relevant tools.
Success Story
Include a realistic case study or example.
Frequently Asked Questions
Include 5-8 SEO-friendly questions and answers.
Final Thoughts
End with a powerful motivational conclusion that:
Encourages action.
Emphasizes consistency.
Reinforces the possibility of success.
STYLE GUIDELINES
Writing style should be:
Inspirational but realistic.
Professional yet conversational.
Easy to understand.
Trustworthy and data-driven.
Positive and encouraging.
Focused on long-term success rather than "get rich quick" schemes.
Use short paragraphs, strong subheadings, bullet points where appropriate, and engaging transitions.
Always write from the perspective of helping readers build sustainable online income streams.
At the end of every article include:
"About the Author
Irina Vovk is a digital entrepreneur and online income researcher who helps readers discover practical, ethical, and scalable ways to earn money online through the latest digital opportunities."
Generate three different article topics per day targeting different online income categories and different keyword opportunities.`,
  generationTime: '08:00',
  generationFrequency: 'daily',
  generationMode: 'daily',
  generationCount: 1,
  generationTimes: ['08:00'],
  generationWeekdays: [1],
  autoGenerationEnabled: false,
};

function normalizeSettings(input: Partial<AdminSettings>): AdminSettings {
  const merged = { ...defaultSettings, ...input };
  const times = Array.isArray(merged.generationTimes) && merged.generationTimes.length > 0
    ? merged.generationTimes
    : [merged.generationTime || defaultSettings.generationTime];
  const cleanTimes = times
    .map((time) => String(time).trim())
    .filter((time) => /^\d{2}:\d{2}$/.test(time))
    .slice(0, 12);
  const count = Math.min(12, Math.max(1, Number(merged.generationCount) || cleanTimes.length || 1));
  const weekdays = Array.isArray(merged.generationWeekdays) && merged.generationWeekdays.length > 0
    ? merged.generationWeekdays.map(Number).filter((day) => day >= 0 && day <= 6)
    : defaultSettings.generationWeekdays;

  return {
    ...merged,
    generationMode: merged.generationMode || merged.generationFrequency || 'daily',
    generationFrequency: merged.generationMode || merged.generationFrequency || 'daily',
    generationCount: count,
    generationTimes: cleanTimes.length > 0 ? cleanTimes.slice(0, count) : defaultSettings.generationTimes,
    generationTime: (cleanTimes[0] || merged.generationTime || defaultSettings.generationTime),
    generationWeekdays: [...new Set(weekdays)].sort(),
    autoGenerationEnabled: Boolean(merged.autoGenerationEnabled),
  };
}

export async function getAdminSettings(): Promise<AdminSettings> {
  const result = await query<{ value: Partial<AdminSettings> }>('SELECT value FROM admin_settings WHERE key = $1', ['generation']);
  return normalizeSettings(result.rows[0]?.value || {});
}

export async function updateAdminSettings(input: Partial<AdminSettings>): Promise<AdminSettings> {
  const next = normalizeSettings({ ...(await getAdminSettings()), ...input });
  await query(
    `INSERT INTO admin_settings (key, value) VALUES ('generation', $1)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = now()`,
    [JSON.stringify(next)],
  );
  return next;
}
