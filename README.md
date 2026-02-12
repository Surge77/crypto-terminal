# CryptoNexus - Real-Time Crypto Intelligence

A modern cryptocurrency analytics dashboard built with Next.js 16, featuring real-time price tracking, interactive candlestick charts, Fear & Greed Index, and portfolio management.

## Features

- **Real-Time Price Tracking** - Live cryptocurrency prices via CoinGecko WebSocket
- **Interactive Candlestick Charts** - Powered by Lightweight Charts with multiple timeframes
- **Fear & Greed Index** - Visual gauge showing current market sentiment
- **Watchlist** - Save your favorite coins with localStorage persistence
- **Portfolio Tracker** - Track holdings, calculate P&L with real-time prices
- **Trending Coins** - See what's hot in the crypto market
- **Category Analysis** - Browse top crypto categories by market cap
- **Coin Details** - Deep dive into any coin with exchange listings and live trades
- **Currency Converter** - Convert between crypto and fiat currencies

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Lightweight Charts (TradingView)
- **Data**: CoinGecko API + WebSocket
- **UI Components**: Radix UI primitives
- **State**: React Context + localStorage

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```
   COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
   COINGECKO_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
app/
├── page.tsx              # Homepage with market stats, Fear & Greed, trending
├── coins/page.tsx        # All coins with pagination
├── coins/[id]/page.tsx   # Coin detail with live data
├── watchlist/page.tsx    # Watchlist & portfolio management
components/
├── Header.tsx            # Navigation with live indicator
├── Footer.tsx            # Site footer
├── home/
│   ├── MarketStats.tsx   # Global market statistics
│   ├── FearGreedIndex.tsx # Fear & Greed gauge
│   ├── TrendingCoins.tsx # Trending coins table
│   ├── CoinOverview.tsx  # Bitcoin overview chart
│   └── Categories.tsx    # Top categories table
context/
├── WatchlistContext.tsx   # Watchlist + Portfolio state
lib/
├── coingecko.actions.ts  # CoinGecko API fetcher
├── feargreed.actions.ts  # Fear & Greed Index API
└── utils.ts              # Utility functions
```

## License

MIT
