import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const MIN_MATCHES = 1000;

export default function TopWinRateChart({ heroes }) {
  const data = [...(heroes || [])]
    .filter((hero) => hero.matches >= MIN_MATCHES)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 10)
    .map((hero) => ({
      name: hero.localizedName,
      winRate: hero.winRate,
      matches: hero.matches
    }));

  if (!data.length) {
    return <div className="chart-empty">Sem dados com volume minimo de partidas.</div>;
  }

  return (
    <article className="chart-card">
      <h3>Top 10 por Win Rate</h3>
      <p className="chart-note">Considerando apenas herois com pelo menos {MIN_MATCHES} matches.</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value, name) =>
              name === 'winRate' ? [`${Number(value).toFixed(2)}%`, 'Win Rate'] : [value, name]
            }
          />
          <Bar dataKey="winRate" fill="#2b6cb0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}
