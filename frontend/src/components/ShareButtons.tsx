'use client';

import React from 'react';
import { AtSign, Send } from 'lucide-react';
import { siteUrl } from '../lib/siteConfig';

type ShareButtonsProps = {
  title: string;
  slug: string;
};

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const fallbackUrl = siteUrl(`/articles/${slug}`);
  const [url, setUrl] = React.useState(fallbackUrl);

  React.useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const text = encodeURIComponent(`${title} ${url}`);

  const links = [
    {
      label: 'Threads',
      href: `https://www.threads.net/intent/post?text=${text}`,
      icon: <AtSign size={18} />,
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <span className="text-sm font-black leading-none">X</span>,
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <Send size={18} />,
    },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Share on ${link.label}`}
          title={link.label}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-stone-300 bg-[#fffdf8]/80 text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-950 hover:bg-white dark:border-stone-800 dark:bg-stone-950/70 dark:text-stone-100 dark:hover:border-stone-500"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
