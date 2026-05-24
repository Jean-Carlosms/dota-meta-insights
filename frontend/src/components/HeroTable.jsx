import { Link } from 'react-router-dom';
import HeroTierBadge from './HeroTierBadge.jsx';
import HeroPositionBadge from './HeroPositionBadge.jsx';
import HeroImage from './HeroImage.jsx';
import MetricBar from './MetricBar.jsx';
import StatusMessage from './StatusMessage.jsx';

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value || 0);
}

function getMetricTone(value, thresholds) {
  if (value >= thresholds.good) return 'good';
  if (value >= thresholds.mid) return 'mid';
  return thresholds.bad || 'bad';
}

function getSortClass(sortBy, key) {
  return sortBy === key ? 'active-sort' : '';
}

function SecondaryPositions({ hero }) {
  const secondary = (hero.positions || []).filter((position) => position !== hero.primaryPosition);
  const title = (hero.positions || []).join(' / ');

  return (
    <div className="compact-position-cell" title={title}>
      <HeroPositionBadge position={hero.primaryPosition} compact />
      {secondary.length ? <span>{secondary.join(' / ')}</span> : null}
    </div>
  );
}

function CompactRoles({ roles }) {
  const visibleRoles = roles.slice(0, 2);
  const hiddenCount = Math.max(roles.length - visibleRoles.length, 0);

  return (
    <div className="role-list compact dense" title={roles.join(' / ')}>
      {visibleRoles.map((role) => (
        <span key={role}>{role}</span>
      ))}
      {hiddenCount ? <span>+{hiddenCount}</span> : null}
    </div>
  );
}

export default function HeroTable({ heroes, tableDensity = 'compact', sortBy = 'metaScore' }) {
  if (!heroes.length) {
    return (
      <StatusMessage
        type="info"
        title="Nenhum resultado"
        message="Nenhum heroi encontrado com os filtros atuais. Ajuste os filtros para ampliar a busca."
      />
    );
  }

  const maxMatches = Math.max(...heroes.map((hero) => hero.matches || 0), 1);
  const maxPickRate = Math.max(...heroes.map((hero) => hero.pickRate || 0), 1);

  return (
    <div className={`table-shell ${tableDensity === 'compact' ? 'compact-table' : 'comfortable-table'}`}>
      <table className="meta-table">
        <thead>
          <tr className="table-group-row">
            <th colSpan="5">HERO</th>
            <th colSpan="4">Meta Stats</th>
            <th colSpan="2">Reliability</th>
            <th colSpan="2">Classification</th>
          </tr>
          <tr>
            <th>Tier</th>
            <th>Heroi</th>
            <th>Posicao</th>
            <th>Atributo primario</th>
            <th>Tipo de ataque</th>
            <th className={getSortClass(sortBy, 'matches')}>Matches</th>
            <th className={getSortClass(sortBy, 'winRate')}>Win Rate</th>
            <th className={getSortClass(sortBy, 'pickRate')}>Pick Rate</th>
            <th className={getSortClass(sortBy, 'metaScore')}>Meta Score</th>
            <th className={getSortClass(sortBy, 'confidenceScore')}>Confianca</th>
            <th>Sample Size</th>
            <th>Roles</th>
            <th>Tier</th>
          </tr>
        </thead>
        <tbody>
          {heroes.map((hero) => (
            <tr key={hero.id} className={`row-tier-${hero.tier?.toLowerCase()}`}>
              <td>
                <HeroTierBadge tier={hero.tier} />
              </td>
              <td>
                <div className="hero-name-cell">
                  <HeroImage hero={hero} className="hero-icon" />
                  <div>
                    <Link className="hero-link" to={`/heroes/${hero.id}`}>
                      <strong>{hero.localizedName}</strong>
                    </Link>
                    <span className="hero-code">{hero.name}</span>
                  </div>
                </div>
              </td>
              <td>
                <SecondaryPositions hero={hero} />
              </td>
              <td>{hero.primaryAttr?.toUpperCase()}</td>
              <td>{hero.attackType}</td>
              <td>
                <MetricBar value={hero.matches} max={maxMatches} variant="neutral" label={`${formatNumber(hero.matches)} matches`}>
                  {formatNumber(hero.matches)}
                </MetricBar>
              </td>
              <td>
                <span className={`metric-value metric-${getMetricTone(hero.winRate, { good: 53, mid: 50 })}`}>
                  {hero.winRate.toFixed(2)}%
                </span>
              </td>
              <td>
                <MetricBar value={hero.pickRate} max={maxPickRate} variant="neutral" label={`${hero.pickRate.toFixed(2)}% pick rate`}>
                  {hero.pickRate.toFixed(2)}%
                </MetricBar>
              </td>
              <td>
                <MetricBar
                  value={hero.metaScore}
                  max={100}
                  variant={getMetricTone(hero.metaScore, { good: 80, mid: 65, bad: 'neutral' })}
                  label={`${hero.metaScore.toFixed(1)} Meta Score`}
                >
                  <span className={`metric-value metric-${getMetricTone(hero.metaScore, { good: 80, mid: 65, bad: 'neutral' })}`}>
                    {hero.metaScore.toFixed(1)}
                  </span>
                </MetricBar>
              </td>
              <td>
                <MetricBar
                  value={hero.confidenceScore || 0}
                  max={100}
                  variant={getMetricTone(hero.confidenceScore || 0, { good: 70, mid: 40 })}
                  label={`${(hero.confidenceScore || 0).toFixed(1)}% confidence`}
                >
                  <span className={`metric-value metric-${getMetricTone(hero.confidenceScore || 0, { good: 70, mid: 40 })}`}>
                    {(hero.confidenceScore || 0).toFixed(1)}%
                  </span>
                </MetricBar>
              </td>
              <td>
                <span className="sample-pill">{hero.sampleSizeLabel || '-'}</span>
              </td>
              <td>
                <CompactRoles roles={hero.roles} />
              </td>
              <td>
                <HeroTierBadge tier={hero.tier} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
