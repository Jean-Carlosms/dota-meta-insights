import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HeroPositionBadge from '../components/HeroPositionBadge.jsx';
import HeroTierBadge from '../components/HeroTierBadge.jsx';
import HeroImage from '../components/HeroImage.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { getHeroMeta } from '../services/api.js';

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR').format(value || 0);
}

function StatItem({ label, value }) {
  return (
    <article className="detail-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function HighlightMetric({ label, value, helper }) {
  return (
    <article className="highlight-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <small>{helper}</small> : null}
    </article>
  );
}

export default function HeroDetail() {
  const { heroId } = useParams();
  const navigate = useNavigate();
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHero() {
      setLoading(true);
      setError('');

      try {
        const payload = await getHeroMeta();
        const foundHero = payload.heroes.find((item) => String(item.id) === String(heroId));

        if (!foundHero) {
          setError('Heroi nao encontrado.');
          return;
        }

        setHero(foundHero);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadHero();
  }, [heroId]);

  if (loading) {
    return (
      <main className="dashboard">
        <StatusMessage
          type="loading"
          title="Carregando heroi"
          message="Buscando dados processados pela API local."
        />
      </main>
    );
  }

  if (error || !hero) {
    return (
      <main className="dashboard">
        <StatusMessage
          type="error"
          title="Nao foi possivel carregar o heroi"
          message={error || 'Heroi nao encontrado.'}
        />
        <button className="refresh-button" type="button" onClick={() => navigate('/')}>
          Voltar ao dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="detail-header">
        <div className="detail-hero-layout">
          <HeroImage hero={hero} variant="image" className="hero-image" />
          <div>
            <Link className="back-link" to="/">Back to dashboard</Link>
            <h1>{hero.localizedName}</h1>
            <p>
              Hero profile based on public OpenDota data, custom analytics, and inferred positions.
            </p>
            <div className="detail-badges">
              <HeroTierBadge tier={hero.tier} />
              {(hero.positions || []).map((position) => (
                <HeroPositionBadge key={position} position={position} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="detail-section">
        <div className="section-heading">
          <div>
            <h2>Hero Overview</h2>
            <p>Core identity and role tags from OpenDota.</p>
          </div>
        </div>
        <div className="detail-grid">
          <StatItem label="Atributo primario" value={hero.primaryAttr?.toUpperCase()} />
          <StatItem label="Tipo de ataque" value={hero.attackType} />
          <StatItem label="Amostra" value={hero.sampleSizeLabel || '-'} />
          <StatItem label="Matches" value={formatNumber(hero.matches)} />
          <StatItem label="Wins" value={formatNumber(hero.wins)} />
          <StatItem label="Internal name" value={hero.name} />
        </div>
      </section>

      <section className="detail-section">
        <div className="section-heading">
          <div>
            <h2>Meta Performance</h2>
            <p>Analytical metrics calculated from the current OpenDota payload.</p>
          </div>
        </div>
        <div className="highlight-grid">
          <HighlightMetric label="Meta Score" value={hero.metaScore.toFixed(1)} helper={`Tier ${hero.tier}`} />
          <HighlightMetric
            label="DotaMeta Rating"
            value={(hero.ratingScore || 0).toFixed(1)}
            helper="Meta Score + confidence"
          />
          <HighlightMetric label="Win Rate" value={`${hero.winRate.toFixed(2)}%`} helper="Wins over matches" />
          <HighlightMetric label="Pick Rate" value={`${hero.pickRate.toFixed(2)}%`} helper="Approximate share" />
          <HighlightMetric
            label="Contest Approx"
            value={`${(hero.contestRateApprox || 0).toFixed(2)}%`}
            helper="Derived from pick rate"
          />
          <HighlightMetric
            label="Confidence"
            value={`${(hero.confidenceScore || 0).toFixed(1)}%`}
            helper={hero.sampleSizeLabel || '-'}
          />
        </div>
      </section>

      <section className="detail-section detail-columns">
        <article className="detail-panel">
          <h2>Inferred Positions</h2>
          <p>
            These positions are inferred from OpenDota roles. They are useful for portfolio-level
            filtering, but they are not real match position data.
          </p>
          <div className="detail-badges">
            {(hero.positions || []).map((position) => (
              <HeroPositionBadge key={position} position={position} />
            ))}
          </div>
        </article>

        <article className="detail-panel">
          <h2>Roles</h2>
          <div className="role-list">
            {hero.roles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="detail-panel detail-limitations">
        <h2>Data Limitations</h2>
        <p>
          OpenDota is the main public data source in this version. Positions are inferred by
          heuristic from hero roles, not measured from real match lanes or position assignments.
          Contest Approx and DotaMeta Rating are derived indicators, not Dota2ProTracker metrics.
          Lane presence remains planned because this payload does not include real lane data.
          Future STRATZ GraphQL integration can enrich this page with real position data, patch,
          rank, trends, and builds by role.
        </p>
      </section>
    </main>
  );
}
