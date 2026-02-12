import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency } from '@/lib/utils';

interface GlobalData {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    active_cryptocurrencies: number;
    market_cap_change_percentage_24h_usd: number;
  };
}

const MarketStats = async () => {
  try {
    const globalData = await fetcher<GlobalData>('/global', undefined, 120);
    const data = globalData.data;

    const stats = [
      {
        label: 'Total Market Cap',
        value: formatCurrency(data.total_market_cap.usd, 0),
      },
      {
        label: '24h Volume',
        value: formatCurrency(data.total_volume.usd, 0),
      },
      {
        label: 'BTC Dominance',
        value: `${data.market_cap_percentage.btc.toFixed(1)}%`,
      },
      {
        label: 'Active Coins',
        value: data.active_cryptocurrencies.toLocaleString(),
      },
    ];

    return (
      <div id="market-stats" className="animate-fade-in">
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch {
    return null;
  }
};

export default MarketStats;
