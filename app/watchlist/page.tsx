'use client';

import { useWatchlist } from '@/context/WatchlistContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Trash2, Plus } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface CoinPrice {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist, holdings, addHolding, removeHolding } = useWatchlist();
  const [coins, setCoins] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formCoinId, setFormCoinId] = useState('');
  const [formCoinName, setFormCoinName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formBuyPrice, setFormBuyPrice] = useState('');

  useEffect(() => {
    let cancelled = false;
    const ids = watchlist.join(',');
    if (!ids) {
      Promise.resolve().then(() => {
        if (!cancelled) setCoins([]);
      });
      return () => {
        cancelled = true;
      };
    }
    Promise.resolve()
      .then(() => {
        if (!cancelled) setLoading(true);
        return fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`,
        );
      })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setCoins(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [watchlist]);

  // Calculate portfolio values
  const totalInvested = holdings.reduce((sum, h) => sum + h.amount * h.buyPrice, 0);
  const currentValues = holdings.map((h) => {
    const coin = coins.find((c) => c.id === h.coinId);
    return coin ? h.amount * coin.current_price : h.amount * h.buyPrice;
  });
  const totalCurrent = currentValues.reduce((sum, v) => sum + v, 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCoinId || !formAmount || !formBuyPrice) return;
    addHolding({
      coinId: formCoinId.toLowerCase(),
      coinName: formCoinName || formCoinId,
      amount: parseFloat(formAmount),
      buyPrice: parseFloat(formBuyPrice),
    });
    setFormCoinId('');
    setFormCoinName('');
    setFormAmount('');
    setFormBuyPrice('');
  };

  return (
    <main id="watchlist-page" className="animate-fade-in">
      <div className="content">
        <h2>Watchlist</h2>

        {watchlist.length === 0 ? (
          <div className="bg-dark-500/80 rounded-xl p-8 border border-emerald-600/5 text-center">
            <Star className="mx-auto mb-3 text-gray-500" size={32} />
            <p className="text-gray-400">Your watchlist is empty.</p>
            <p className="text-gray-500 text-sm mt-1">
              Add coins from the{' '}
              <Link href="/coins" className="text-emerald-500 hover:underline">
                All Coins
              </Link>{' '}
              page or coin detail pages.
            </p>
          </div>
        ) : (
          <div className="watchlist-table custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-400/50 text-left text-sm text-gray-400">
                  <th className="py-3 pl-5">Coin</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">24h Change</th>
                  <th className="py-3">Market Cap</th>
                  <th className="py-3 pr-5"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  coins.map((coin) => (
                    <tr key={coin.id} className="border-b border-dark-400/30">
                      <td className="py-4 pl-5">
                        <Link
                          href={`/coins/${coin.id}`}
                          className="flex items-center gap-3 hover:text-emerald-400 transition-colors"
                        >
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <span className="font-semibold">{coin.name}</span>
                          <span className="text-gray-500 text-sm uppercase">{coin.symbol}</span>
                        </Link>
                      </td>
                      <td className="py-4 font-medium">{formatCurrency(coin.current_price)}</td>
                      <td className="py-4">
                        <span
                          className={
                            coin.price_change_percentage_24h > 0
                              ? 'text-emerald-500'
                              : 'text-red-500'
                          }
                        >
                          {coin.price_change_percentage_24h > 0 ? '+' : ''}
                          {formatPercentage(coin.price_change_percentage_24h)}
                        </span>
                      </td>
                      <td className="py-4 font-medium">{formatCurrency(coin.market_cap, 0)}</td>
                      <td className="py-4 pr-5">
                        <button
                          onClick={() => removeFromWatchlist(coin.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove from watchlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Portfolio Section */}
        <div className="portfolio-section">
          <h2>Portfolio</h2>

          {/* Summary Cards */}
          <div className="portfolio-summary">
            <div className="summary-card">
              <p className="summary-label">Total Invested</p>
              <p className="summary-value">{formatCurrency(totalInvested)}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Current Value</p>
              <p className="summary-value">{formatCurrency(totalCurrent)}</p>
            </div>
            <div className="summary-card">
              <p className="summary-label">Total P&L</p>
              <p className={`summary-value ${totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {totalPnL >= 0 ? '+' : ''}
                {formatCurrency(totalPnL)} ({totalPnLPercent.toFixed(1)}%)
              </p>
            </div>
          </div>

          {/* Add Holding Form */}
          <form onSubmit={handleAddHolding} className="add-holding-form">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Coin ID</label>
              <input
                type="text"
                placeholder="e.g. bitcoin"
                value={formCoinId}
                onChange={(e) => setFormCoinId(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Coin Name</label>
              <input
                type="text"
                placeholder="e.g. Bitcoin"
                value={formCoinName}
                onChange={(e) => setFormCoinName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Amount</label>
              <input
                type="number"
                step="any"
                placeholder="0.5"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">Buy Price (USD)</label>
              <input
                type="number"
                step="any"
                placeholder="45000"
                value={formBuyPrice}
                onChange={(e) => setFormBuyPrice(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="flex items-center gap-1">
              <Plus size={16} /> Add
            </button>
          </form>

          {/* Holdings Table */}
          {holdings.length > 0 && (
            <div className="holdings-table custom-scrollbar">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-400/50 text-left text-sm text-gray-400">
                    <th className="py-3 pl-5">Coin</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Buy Price</th>
                    <th className="py-3">Current Price</th>
                    <th className="py-3">P&L</th>
                    <th className="py-3 pr-5"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding, index) => {
                    const coin = coins.find((c) => c.id === holding.coinId);
                    const currentPrice = coin?.current_price ?? holding.buyPrice;
                    const pnl = (currentPrice - holding.buyPrice) * holding.amount;
                    const pnlPercent =
                      holding.buyPrice > 0
                        ? ((currentPrice - holding.buyPrice) / holding.buyPrice) * 100
                        : 0;

                    return (
                      <tr key={index} className="border-b border-dark-400/30">
                        <td className="py-4 pl-5 font-semibold">{holding.coinName}</td>
                        <td className="py-4">{holding.amount}</td>
                        <td className="py-4">{formatCurrency(holding.buyPrice)}</td>
                        <td className="py-4">{formatCurrency(currentPrice)}</td>
                        <td className="py-4">
                          <span className={pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                            {pnl >= 0 ? '+' : ''}
                            {formatCurrency(pnl)} ({pnlPercent.toFixed(1)}%)
                          </span>
                        </td>
                        <td className="py-4 pr-5">
                          <button
                            onClick={() => removeHolding(index)}
                            className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove holding"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default WatchlistPage;
