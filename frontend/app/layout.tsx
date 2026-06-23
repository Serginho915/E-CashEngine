import './layout.css';
import React from 'react';
import Script from 'next/script';
import Providers from '../src/components/Providers';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import CookieMenu from '../src/components/CookieMenu';
import { siteConfig } from '../src/lib/siteConfig';

const siteTitle = 'e-CashEngine | Practical Ways to Make Money Online';
const siteDescription = 'Daily guides by Irina Vovk about ethical online income, affiliate marketing, freelancing, AI side hustles, ecommerce, and passive income.';

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteTitle,
    template: '%s | e-CashEngine',
  },
  description: siteDescription,
  applicationName: 'e-CashEngine',
  authors: [{ name: 'Irina Vovk', url: siteConfig.siteUrl }],
  creator: 'Irina Vovk',
  publisher: 'e-CashEngine',
  category: 'Online income',
  keywords: [
    'make money online',
    'online income',
    'affiliate marketing',
    'AI side hustles',
    'freelancing',
    'remote jobs',
    'passive income',
    'ecommerce',
    'digital products',
    'SEO services',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'e-CashEngine',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/logo.png',
        width: 546,
        height: 457,
        alt: 'e-CashEngine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieMenu />
        </Providers>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token":"d3b9f0fd8d7140e3a993976aebe8639a"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
