import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import HeroImage from '../HeroImage.jsx';

const METRIC_FORMATTERS = {
  metaScore: (value) => Number(value).toFixed(1),
  winRate: (value) => `${Number(value).toFixed(2)}%`,
  pickRate: (value) => `${Number(value).toFixed(2)}%`,
  matches: (value) => new Intl.NumberFormat('pt-BR').format(value || 0),
  confidenceScore: (value) => `${Number(value).toFixed(1)}%`
};

function abbreviateHeroName(name) {
  return name
    .split(/[\s-]+/)
    .map((part) => part.slice(0, 3))
    .join(' ')
    .slice(0, 12);
}

export default function HeroMetricRankingChart({ heroes, metric, metricLabel }) {
  const formatter = METRIC_FORMATTERS[metric] || METRIC_FORMATTERS.metaScore;
  const data = [...(heroes || [])]
    .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, 20)
    .map((hero) => ({
      hero: abbreviateHeroName(hero.localizedName),
      heroData: hero,
      fullName: hero.localizedName,
      value: hero[metric] || 0,
      tier: hero.tier
    }));

  if (!data.length) {
    return <div className="chart-empty chart-dark">No heroes match the active filters.</div>;
  }

  return (
    <article className="metric-ranking-card">
      <div className="metric-ranking-header">
        <div>
          <h3>Top 20 heroes by {metricLabel}</h3>
          <p>Filtered by the current dashboard controls.</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 34, left: 38, bottom: 8 }}>
          <CartesianGrid stroke="#203044" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" stroke="#8ea4bf" tick={{ fill: '#8ea4bf', fontSize: 11 }} />
          <YAxis
            dataKey="hero"
            type="category"
            width={82}
            stroke="#8ea4bf"
            tick={{ fill: '#d7e2ef', fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(95, 179, 255, 0.08)' }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }

              const item = payload[0].payload;

              return (
                <div className="hero-chart-tooltip">
                  <HeroImage hero={item.heroData} className="hero-icon" />
                  <div>
                    <strong>{item.fullName}</strong>
                    <span>{metricLabel}: {formatter(item.value)}</span>
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="value" fill="#34d399" radius={[0, 7, 7, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}
