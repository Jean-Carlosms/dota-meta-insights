import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getPositionLabel } from '../HeroPositionBadge.jsx';

const POSITION_KEYS = ['carry', 'mid', 'offlane', 'soft_support', 'hard_support'];

export default function PositionLeadersChart({ leaders }) {
  const data = POSITION_KEYS.map((position) => {
    const hero = leaders?.[position];

    return {
      position: getPositionLabel(position),
      heroName: hero?.localizedName || 'Sem dados',
      score: hero?.metaScore || 0
    };
  });

  if (!data.some((item) => item.score > 0)) {
    return <div className="chart-empty">Sem dados por posicao.</div>;
  }

  return (
    <article className="chart-card">
      <h3>Melhor Meta Score por Posicao</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="position" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value, name, props) => [
              `${Number(value).toFixed(1)} pontos`,
              props.payload.heroName
            ]}
          />
          <Bar dataKey="score" fill="#2f855a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}
