import { Link } from 'react-router-dom';
import HeroTierBadge from './HeroTierBadge.jsx';
import HeroPositionBadge from './HeroPositionBadge.jsx';
import StatusMessage from './StatusMessage.jsx';

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value || 0);
}

export default function HeroTable({ heroes }) {
  if (!heroes.length) {
    return (
      <StatusMessage
        type="info"
        title="Nenhum resultado"
        message="Nenhum heroi encontrado com os filtros atuais. Ajuste os filtros para ampliar a busca."
      />
    );
  }

  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Heroi</th>
            <th>Posicao</th>
            <th>Atributo primario</th>
            <th>Tipo de ataque</th>
            <th>Roles</th>
            <th>Matches</th>
            <th>Win Rate</th>
            <th>Pick Rate</th>
            <th>Meta Score</th>
            <th>Confianca</th>
          </tr>
        </thead>
        <tbody>
          {heroes.map((hero) => (
            <tr key={hero.id} className={`row-tier-${hero.tier?.toLowerCase()}`}>
              <td>
                <HeroTierBadge tier={hero.tier} />
              </td>
              <td>
                <Link className="hero-link" to={`/heroes/${hero.id}`}>
                  <strong>{hero.localizedName}</strong>
                </Link>
                <span className="hero-code">{hero.name}</span>
              </td>
              <td>
                <div className="position-stack">
                  <HeroPositionBadge position={hero.primaryPosition} />
                  <div className="secondary-positions">
                    {(hero.positions || [])
                      .filter((position) => position !== hero.primaryPosition)
                      .map((position) => (
                        <HeroPositionBadge key={position} position={position} compact />
                      ))}
                  </div>
                </div>
              </td>
              <td>{hero.primaryAttr?.toUpperCase()}</td>
              <td>{hero.attackType}</td>
              <td>
                <div className="role-list">
                  {hero.roles.map((role) => (
                    <span key={role}>{role}</span>
                  ))}
                </div>
              </td>
              <td>{formatNumber(hero.matches)}</td>
              <td>{hero.winRate.toFixed(2)}%</td>
              <td>{hero.pickRate.toFixed(2)}%</td>
              <td>
                <strong>{hero.metaScore.toFixed(1)}</strong>
              </td>
              <td>
                <strong>{(hero.confidenceScore || 0).toFixed(1)}%</strong>
                <span className="hero-code">{hero.sampleSizeLabel || '-'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
