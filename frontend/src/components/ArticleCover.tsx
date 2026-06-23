'use client';

import React from 'react';
import {
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Cpu,
  FileText,
  Link2,
  PackageOpen,
  PenLine,
  Play,
  ShoppingCart,
  Store,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Article } from '../types';
import { apiUrl } from '../lib/siteConfig';

type ArticleCoverProps = {
  article: Article;
  className?: string;
  compact?: boolean;
};

type ThemeKind = 'affiliate' | 'ai' | 'freelance' | 'ecommerce' | 'digital' | 'finance' | 'general';

type Theme = {
  kind: ThemeKind;
  match: string[];
  bg: string;
  panel: string;
  accent: string;
  soft: string;
  icon: LucideIcon;
};

const themes: Theme[] = [
  {
    kind: 'affiliate',
    match: ['affiliate', 'marketing', 'email', 'seo'],
    bg: 'linear-gradient(135deg, #102a43 0%, #1d4ed8 48%, #d97706 100%)',
    panel: 'rgba(255,255,255,.14)',
    accent: '#fbbf24',
    soft: 'rgba(251,191,36,.18)',
    icon: TrendingUp,
  },
  {
    kind: 'ai',
    match: ['ai', 'app', 'automation', 'software'],
    bg: 'linear-gradient(135deg, #111827 0%, #0e7490 50%, #16a34a 100%)',
    panel: 'rgba(255,255,255,.13)',
    accent: '#67e8f9',
    soft: 'rgba(103,232,249,.16)',
    icon: Cpu,
  },
  {
    kind: 'freelance',
    match: ['freelance', 'copywriting', 'consulting', 'remote', 'assistant'],
    bg: 'linear-gradient(135deg, #1c1917 0%, #7c2d12 50%, #d97706 100%)',
    panel: 'rgba(255,255,255,.14)',
    accent: '#fed7aa',
    soft: 'rgba(254,215,170,.18)',
    icon: BriefcaseBusiness,
  },
  {
    kind: 'ecommerce',
    match: ['dropshipping', 'ecommerce', 'amazon', 'print', 'demand', 'shopify'],
    bg: 'linear-gradient(135deg, #0f172a 0%, #0f766e 52%, #65a30d 100%)',
    panel: 'rgba(255,255,255,.14)',
    accent: '#a7f3d0',
    soft: 'rgba(167,243,208,.16)',
    icon: Store,
  },
  {
    kind: 'digital',
    match: ['digital', 'course', 'product', 'blogging', 'youtube', 'tiktok'],
    bg: 'linear-gradient(135deg, #312e81 0%, #7e22ce 48%, #db2777 100%)',
    panel: 'rgba(255,255,255,.13)',
    accent: '#f0abfc',
    soft: 'rgba(240,171,252,.16)',
    icon: PenLine,
  },
  {
    kind: 'finance',
    match: ['crypto', 'investing', 'passive', 'income', 'stock'],
    bg: 'linear-gradient(135deg, #0f172a 0%, #166534 48%, #ca8a04 100%)',
    panel: 'rgba(255,255,255,.14)',
    accent: '#bef264',
    soft: 'rgba(190,242,100,.17)',
    icon: BadgeDollarSign,
  },
];

function getTheme(article: Article): Theme {
  const haystack = `${article.category || ''} ${article.title} ${article.tags?.join(' ') || ''} ${article.imagePrompt || ''}`.toLowerCase();

  return themes.find((theme) => theme.match.some((term) => haystack.includes(term))) || {
    kind: 'general',
    match: [],
    bg: 'linear-gradient(135deg, #111827 0%, #334155 48%, #0f766e 100%)',
    panel: 'rgba(255,255,255,.13)',
    accent: '#cbd5e1',
    soft: 'rgba(203,213,225,.16)',
    icon: BarChart3,
  };
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-white/20 bg-white/12 shadow-[0_18px_50px_rgba(0,0,0,.22)] backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

function Scene({ theme, compact }: { theme: Theme; compact: boolean }) {
  const Icon = theme.icon || PackageOpen;

  if (theme.kind === 'ecommerce') {
    return (
      <>
        <Panel className="absolute left-[12%] top-[20%] h-[34%] w-[30%] p-4">
          <div className="grid h-full grid-cols-2 gap-3">
            {[PackageOpen, ShoppingCart, Store, BadgeDollarSign].map((ItemIcon, index) => (
              <div key={index} className="grid place-items-center rounded-lg" style={{ backgroundColor: index === 0 ? theme.soft : 'rgba(255,255,255,.12)' }}>
                <ItemIcon size={compact ? 18 : 26} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="absolute bottom-[17%] right-[12%] h-[42%] w-[38%] p-5">
          <div className="mb-5 h-2 w-16 rounded-full" style={{ backgroundColor: theme.accent }} />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="aspect-square rounded-lg border border-white/15 bg-white/14" />
            ))}
          </div>
        </Panel>
      </>
    );
  }

  if (theme.kind === 'ai') {
    return (
      <>
        <Panel className="absolute left-[15%] top-[18%] grid h-[42%] w-[35%] place-items-center">
          <div className="relative grid h-24 w-24 place-items-center rounded-2xl border border-white/25" style={{ backgroundColor: theme.soft }}>
            <Cpu size={compact ? 34 : 46} />
            <span className="absolute -left-5 top-1/2 h-px w-5 bg-white/45" />
            <span className="absolute -right-5 top-1/2 h-px w-5 bg-white/45" />
            <span className="absolute left-1/2 -top-5 h-5 w-px bg-white/45" />
            <span className="absolute bottom-[-20px] left-1/2 h-5 w-px bg-white/45" />
          </div>
        </Panel>
        <div className="absolute bottom-[18%] right-[12%] grid w-[34%] gap-3">
          {[FileText, PenLine, BarChart3].map((ItemIcon, index) => (
            <Panel key={index} className="flex items-center gap-3 p-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: index === 1 ? theme.soft : 'rgba(255,255,255,.12)' }}>
                <ItemIcon size={18} />
              </div>
              <div className="h-2 flex-1 rounded-full bg-white/25" />
            </Panel>
          ))}
        </div>
      </>
    );
  }

  if (theme.kind === 'freelance') {
    return (
      <>
        <Panel className="absolute left-[13%] top-[16%] h-[56%] w-[34%] p-5">
          <FileText size={compact ? 30 : 42} className="mb-5" />
          <div className="space-y-3">
            <div className="h-2 w-full rounded-full bg-white/35" />
            <div className="h-2 w-4/5 rounded-full bg-white/22" />
            <div className="h-2 w-2/3 rounded-full bg-white/22" />
          </div>
          <div className="mt-7 h-10 rounded-lg" style={{ backgroundColor: theme.soft }} />
        </Panel>
        <Panel className="absolute bottom-[18%] right-[13%] grid h-[34%] w-[36%] place-items-center">
          <PenLine size={compact ? 44 : 64} />
        </Panel>
      </>
    );
  }

  if (theme.kind === 'digital') {
    return (
      <>
        <Panel className="absolute left-[12%] top-[18%] h-[45%] w-[38%] p-4">
          <div className="grid h-full grid-rows-[1fr_auto] gap-4">
            <div className="grid place-items-center rounded-xl" style={{ backgroundColor: theme.soft }}>
              <Play size={compact ? 34 : 48} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-2 rounded-full bg-white/30" />
              <div className="h-2 rounded-full bg-white/20" />
              <div className="h-2 rounded-full bg-white/20" />
            </div>
          </div>
        </Panel>
        <Panel className="absolute bottom-[17%] right-[13%] h-[38%] w-[32%] p-5">
          <BookOpen size={compact ? 28 : 38} className="mb-4" />
          <div className="space-y-3">
            <div className="h-3 rounded-full bg-white/30" />
            <div className="h-3 w-3/4 rounded-full bg-white/18" />
          </div>
        </Panel>
      </>
    );
  }

  if (theme.kind === 'affiliate') {
    return (
      <>
        <Panel className="absolute left-[12%] top-[18%] h-[44%] w-[40%] p-5">
          <div className="flex h-full items-end gap-3">
            {[36, 55, 42, 76, 92].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-lg bg-white/24" style={{ height: `${height}%`, backgroundColor: index === 4 ? theme.accent : undefined }} />
            ))}
          </div>
        </Panel>
        <div className="absolute bottom-[20%] right-[13%] grid w-[34%] gap-3">
          {[Link2, TrendingUp, BadgeDollarSign].map((ItemIcon, index) => (
            <Panel key={index} className="flex items-center gap-3 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: index === 2 ? theme.soft : 'rgba(255,255,255,.12)' }}>
                <ItemIcon size={19} />
              </div>
              <div className="h-2 flex-1 rounded-full bg-white/24" />
            </Panel>
          ))}
        </div>
      </>
    );
  }

  if (theme.kind === 'finance') {
    return (
      <>
        <Panel className="absolute left-[12%] top-[20%] h-[48%] w-[44%] p-5">
          <svg viewBox="0 0 220 120" className="h-full w-full" aria-hidden="true">
            <polyline points="8,96 48,72 88,82 128,42 168,55 212,18" fill="none" stroke={theme.accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="8,104 48,82 88,92 128,55 168,66 212,32" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Panel>
        <Panel className="absolute bottom-[18%] right-[15%] grid h-[34%] w-[30%] place-items-center">
          <BadgeDollarSign size={compact ? 48 : 72} />
        </Panel>
      </>
    );
  }

  return (
    <>
      <Panel className="absolute left-[13%] top-[18%] grid h-[44%] w-[38%] place-items-center">
        <Icon size={compact ? 48 : 72} />
      </Panel>
      <Panel className="absolute bottom-[18%] right-[13%] h-[36%] w-[34%] p-5">
        <div className="mb-5 h-2 w-14 rounded-full" style={{ backgroundColor: theme.accent }} />
        <div className="space-y-3">
          <div className="h-3 rounded-full bg-white/28" />
          <div className="h-3 w-3/4 rounded-full bg-white/18" />
          <div className="h-3 w-1/2 rounded-full bg-white/18" />
        </div>
      </Panel>
    </>
  );
}

export default function ArticleCover({ article, className = '', compact = false }: ArticleCoverProps) {
  const theme = getTheme(article);
  const visualBrief = article.imagePrompt || `${article.category || 'Online income'} editorial visual for ${article.title}`;
  const coverUrl = article.cover?.startsWith('/generated/') ? apiUrl(article.cover) : article.cover;

  if (coverUrl && (article.cover?.startsWith('/generated/') || article.cover?.startsWith('http'))) {
    return (
      <img
        src={coverUrl}
        alt={visualBrief}
        title={visualBrief}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative isolate h-full w-full overflow-hidden bg-stone-950 text-white ${className}`}
      style={{ background: theme.bg }}
      aria-label={visualBrief}
      title={visualBrief}
    >
      <div className="absolute inset-0 opacity-[.18] [background-image:linear-gradient(to_right,rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/16 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute left-[7%] top-[10%] h-[78%] w-[86%] rounded-[2rem] border border-white/10" />
      <Scene theme={theme} compact={compact} />
    </div>
  );
}
