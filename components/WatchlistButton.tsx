'use client';

import { Star } from 'lucide-react';
import { useWatchlist } from '@/context/WatchlistContext';

interface WatchlistButtonProps {
  coinId: string;
  size?: number;
}

const WatchlistButton = ({ coinId, size = 20 }: WatchlistButtonProps) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const active = isInWatchlist(coinId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (active) {
          removeFromWatchlist(coinId);
        } else {
          addToWatchlist(coinId);
        }
      }}
      className={`cursor-pointer transition-all duration-200 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
        active
          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20'
          : 'bg-dark-500/80 border-dark-400 text-gray-400 hover:border-yellow-500/30 hover:text-yellow-500'
      }`}
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        size={size}
        className={active ? 'fill-yellow-500 text-yellow-500' : ''}
      />
      {active ? 'Watching' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;
