import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function TopMetaScoreChart({ heroes }) {
  const data = [...(heroes || [])]
    .sort((a, b) => b.metaScore - a.metaScore)
    .slice(0, 10)
    .map((hero) => ({
      name: hero.localizedName,
      score: hero.metaScore
    }));

  if (!data.length) {
    return <div className="chart-empty">Sem dados para Meta Score.</div>;
  }

  return (
    <article className="chart-card">
      <h3>Top 10 por Meta Score</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} pontos`, 'Meta Score']} />
          <Bar dataKey="score" fill="#d84343" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}
