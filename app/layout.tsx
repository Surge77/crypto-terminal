import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WatchlistProvider } from '@/context/WatchlistContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'CryptoNexus - Real-Time Crypto Intelligence',
    template: '%s | CryptoNexus',
  },
  description:
    'CryptoNexus - Real-time cryptocurrency analytics platform with live price tracking, interactive candlestick charts, Fear & Greed Index, watchlist, and portfolio management.',
  keywords: [
    'cryptocurrency tracker',
    'crypto analytics',
    'bitcoin tracker',
    'crypto portfolio',
    'real-time crypto prices',
    'cryptocurrency dashboard',
    'crypto charts',
    'fear and greed index',
    'crypto watchlist',
    'market analysis',
    'crypto nexus',
    'cryptocurrency intelligence',
  ],
  authors: [{ name: 'CryptoNexus' }],
  creator: 'CryptoNexus',
  publisher: 'CryptoNexus',
  applicationName: 'CryptoNexus',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cryptonexus.vercel.app',
    siteName: 'CryptoNexus',
    title: 'CryptoNexus - Real-Time Crypto Intelligence',
    description:
      'Real-time cryptocurrency analytics with live tracking, Fear & Greed Index, watchlist, portfolio management, and advanced candlestick charts.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'CryptoNexus - Cryptocurrency Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoNexus - Real-Time Crypto Intelligence',
    description:
      'Real-time crypto analytics with Fear & Greed Index, watchlist, and portfolio tracking',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WatchlistProvider>
          <Header />
          {children}
          <Footer />
        </WatchlistProvider>
      </body>
    </html>
  );
}
