'use client';

import { useEffect, useState } from 'react';

// Polling-based implementation using free CoinGecko REST API
export const useCoinGeckoWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch live price data using REST API
  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`,
        );

        if (!response.ok) throw new Error('Failed to fetch price data');

        const data = await response.json();
        const coinData = data[coinId];

        if (coinData) {
          setPrice({
            usd: coinData.usd,
            coin: coinId,
            price: coinData.usd,
            change24h: coinData.usd_24h_change,
            marketCap: coinData.usd_market_cap,
            volume24h: coinData.usd_24h_vol,
            timestamp: Date.now(),
          });
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        setIsConnected(false);
      }
    };

    // Initial fetch
    fetchPriceData();

    // Poll every 30 seconds for price updates
    const priceInterval = setInterval(fetchPriceData, 30000);

    return () => {
      clearInterval(priceInterval);
    };
  }, [coinId]);

  // Fetch OHLC data for live candlestick updates
  useEffect(() => {
    const fetchOHLCData = async () => {
      try {
        // Determine days based on liveInterval
        const days = liveInterval === '1s' || liveInterval === '1m' ? 1 : 7;

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`,
        );

        if (!response.ok) throw new Error('Failed to fetch OHLC data');

        const data: OHLCData[] = await response.json();

        // Get the most recent candle
        if (data && data.length > 0) {
          setOhlcv(data[data.length - 1]);
        }
      } catch (error) {
        console.error('Error fetching OHLC data:', error);
      }
    };

    // Initial fetch
    fetchOHLCData();

    // Poll based on liveInterval (1 minute for both cases since we're using free API)
    const ohlcInterval = setInterval(fetchOHLCData, 60000);

    return () => {
      clearInterval(ohlcInterval);
    };
  }, [coinId, liveInterval]);

  // Note: Recent trades are not available via free REST API
  // The trades array will remain empty

  return {
    price,
    trades,
    ohlcv,
    isConnected,
  };
};
