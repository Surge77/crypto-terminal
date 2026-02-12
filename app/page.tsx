import React, { Suspense } from 'react';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import MarketStats from '@/components/home/MarketStats';
import FearGreedIndex from '@/components/home/FearGreedIndex';
import {
  CategoriesFallback,
  CoinOverviewFallback,
  TrendingCoinsFallback,
} from '@/components/home/fallback';
import Categories from '@/components/home/Categories';

const Page = async () => {
  return (
    <main className="main-container animate-fade-in">
      {/* Hero Market Stats */}
      <Suspense fallback={null}>
        <MarketStats />
      </Suspense>

      {/* Fear & Greed + Trending */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Suspense fallback={null}>
          <FearGreedIndex />
        </Suspense>

        <div className="lg:col-span-2">
          <Suspense fallback={<TrendingCoinsFallback />}>
            <TrendingCoins />
          </Suspense>
        </div>
      </section>

      {/* Bitcoin Overview */}
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
