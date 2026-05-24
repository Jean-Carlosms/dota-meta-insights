import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const TIER_COLORS = {
  S: '#c53030',
  A: '#dd6b20',
  B: '#2f855a',
  C: '#2b6cb0',
  D: '#718096'
};

export default function TierDistributionChart({ heroes }) {
  const counts = (heroes || []).reduce((acc, hero) => {
    acc[hero.tier] = (acc[hero.tier] || 0) + 1;
    return acc;
  }, {});

  const data = ['S', 'A', 'B', 'C', 'D']
    .map((tier) => ({
      tier,
      count: counts[tier] || 0
    }))
    .filter((item) => item.count > 0);

  if (!data.length) {
    return <div className="chart-empty">Sem dados de tiers.</div>;
  }

  return (
    <article className="chart-card">
      <h3>Distribuicao por Tier</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="tier"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            label={({ tier, count }) => `${tier}: ${count}`}
          >
            {data.map((entry) => (
              <Cell key={entry.tier} fill={TIER_COLORS[entry.tier]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, `Tier ${name}`]} />
        </PieChart>
      </ResponsiveContainer>
    </article>
  );
}
