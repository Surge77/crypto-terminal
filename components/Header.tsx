'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useWatchlist } from '@/context/WatchlistContext';

const Header = () => {
  const pathname = usePathname();
  const { watchlist } = useWatchlist();

  return (
    <header>
      <div className="main-container inner">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="CryptoNexus logo" width={180} height={50} />
        </Link>

        <nav>
          <Link
            href="/"
            className={cn('nav-link', {
              'is-active': pathname === '/',
              'is-home': true,
            })}
          >
            Home
          </Link>

          <Link
            href="/coins"
            className={cn('nav-link', {
              'is-active': pathname === '/coins' || pathname.startsWith('/coins/'),
            })}
          >
            All Coins
          </Link>

          <Link
            href="/watchlist"
            className={cn('nav-link', {
              'is-active': pathname === '/watchlist',
            })}
          >
            Watchlist
            {watchlist.length > 0 && (
              <span className="ml-1.5 text-xs bg-emerald-600 text-white rounded-full px-1.5 py-0.5 min-w-5 text-center">
                {watchlist.length}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2 pl-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400 font-medium hidden sm:inline">Live</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
