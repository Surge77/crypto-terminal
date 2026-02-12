'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Holding {
  coinId: string;
  coinName: string;
  amount: number;
  buyPrice: number;
}

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (coinId: string) => void;
  removeFromWatchlist: (coinId: string) => void;
  isInWatchlist: (coinId: string) => boolean;
  holdings: Holding[];
  addHolding: (holding: Holding) => void;
  removeHolding: (index: number) => void;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>(() =>
    getStoredValue('cryptonexus-watchlist', []),
  );
  const [holdings, setHoldings] = useState<Holding[]>(() =>
    getStoredValue('cryptonexus-holdings', []),
  );

  useEffect(() => {
    localStorage.setItem('cryptonexus-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('cryptonexus-holdings', JSON.stringify(holdings));
  }, [holdings]);

  const addToWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => (prev.includes(coinId) ? prev : [...prev, coinId]));
  }, []);

  const removeFromWatchlist = useCallback((coinId: string) => {
    setWatchlist((prev) => prev.filter((id) => id !== coinId));
  }, []);

  const isInWatchlist = useCallback((coinId: string) => watchlist.includes(coinId), [watchlist]);

  const addHolding = useCallback((holding: Holding) => {
    setHoldings((prev) => [...prev, holding]);
  }, []);

  const removeHolding = useCallback((index: number) => {
    setHoldings((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        holdings,
        addHolding,
        removeHolding,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within WatchlistProvider');
  return context;
}
