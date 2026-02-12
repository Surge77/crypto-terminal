import { fetchFearGreedIndex } from '@/lib/feargreed.actions';

function getGaugeColor(value: number): string {
  if (value <= 20) return '#ef4444';
  if (value <= 40) return '#f97316';
  if (value <= 60) return '#eab308';
  if (value <= 80) return '#22c55e';
  return '#10b981';
}

function getGaugeLabel(classification: string): string {
  return classification;
}

const FearGreedIndex = async () => {
  const data = await fetchFearGreedIndex();

  if (!data || !data.data?.length) {
    return (
      <div id="fear-greed-index">
        <h4>Fear & Greed Index</h4>
        <p className="text-gray-400 text-sm">Unable to load market sentiment data.</p>
      </div>
    );
  }

  const current = data.data[0];
  const value = parseInt(current.value);
  const color = getGaugeColor(value);
  const label = getGaugeLabel(current.value_classification);

  // SVG gauge arc calculation
  const radius = 70;
  const strokeWidth = 12;
  const cx = 90;
  const cy = 90;
  // Semi-circle from 180deg to 0deg (left to right)
  const startAngle = Math.PI;
  const endAngle = 0;
  const range = startAngle - endAngle;
  const valueAngle = startAngle - (value / 100) * range;

  const arcStartX = cx + radius * Math.cos(startAngle);
  const arcStartY = cy + radius * Math.sin(startAngle);
  const arcEndX = cx + radius * Math.cos(endAngle);
  const arcEndY = cy + radius * Math.sin(endAngle);

  const needleX = cx + (radius - 10) * Math.cos(valueAngle);
  const needleY = cy + (radius - 10) * Math.sin(valueAngle);

  // Background arc path (full semi-circle)
  const bgArc = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 0 1 ${arcEndX} ${arcEndY}`;

  // Value arc path
  const valEndX = cx + radius * Math.cos(valueAngle);
  const valEndY = cy + radius * Math.sin(valueAngle);
  const largeArcFlag = value > 50 ? 1 : 0;
  const valArc = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${valEndX} ${valEndY}`;

  // Historical mini-bars
  const history = data.data.slice(0, 7).reverse();

  return (
    <div id="fear-greed-index" className="animate-fade-in">
      <h4>Fear & Greed Index</h4>

      <div className="flex flex-col items-center">
        {/* Gauge */}
        <svg width="180" height="110" viewBox="0 0 180 110">
          {/* Gradient background arc */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d={bgArc}
            fill="none"
            stroke="#1f2937"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Gradient arc */}
          <path
            d={bgArc}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Value arc */}
          <path
            d={valArc}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Needle dot */}
          <circle cx={needleX} cy={needleY} r="5" fill={color} />
          <circle cx={needleX} cy={needleY} r="3" fill="#030712" />

          {/* Center value text */}
          <text
            x={cx}
            y={cy - 5}
            textAnchor="middle"
            fill={color}
            fontSize="28"
            fontWeight="bold"
            fontFamily="var(--font-geist-sans)"
          >
            {value}
          </text>

          {/* Labels */}
          <text x="15" y="105" fill="#9ca3af" fontSize="9" fontFamily="var(--font-geist-sans)">
            Fear
          </text>
          <text x="145" y="105" fill="#9ca3af" fontSize="9" fontFamily="var(--font-geist-sans)">
            Greed
          </text>
        </svg>

        {/* Classification */}
        <p className="text-lg font-semibold mt-1" style={{ color }}>
          {label}
        </p>

        {/* 7-day history */}
        <div className="flex items-end gap-1.5 mt-4 h-10">
          {history.map((day, i) => {
            const val = parseInt(day.value);
            const barColor = getGaugeColor(val);
            const height = Math.max(8, (val / 100) * 36);
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-4 rounded-sm transition-all"
                  style={{
                    height: `${height}px`,
                    backgroundColor: barColor,
                    opacity: 0.7 + (i / history.length) * 0.3,
                  }}
                  title={`${val} - ${day.value_classification}`}
                />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-1">7-day history</p>
      </div>
    </div>
  );
};

export default FearGreedIndex;
