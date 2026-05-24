import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import Filters from '../components/Filters.jsx';
import HeroCard from '../components/HeroCard.jsx';
import HeroPositionBadge, { getPositionLabel } from '../components/HeroPositionBadge.jsx';
import HeroTable from '../components/HeroTable.jsx';
import HeroTierBadge from '../components/HeroTierBadge.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { getHeroMeta, refreshHeroMeta } from '../services/api.js';

const TopMetaScoreChart = lazy(() => import('../components/charts/TopMetaScoreChart.jsx'));
const TopWinRateChart = lazy(() => import('../components/charts/TopWinRateChart.jsx'));
const TierDistributionChart = lazy(() => import('../components/charts/TierDistributionChart.jsx'));
const PositionLeadersChart = lazy(() => import('../components/charts/PositionLeadersChart.jsx'));
const HeroMetricRankingChart = lazy(() => import('../components/charts/HeroMetricRankingChart.jsx'));

const initialFilters = {
  search: '',
  tier: 'all',
  primaryAttr: 'all',
  attackType: 'all',
  sortBy: 'metaScore',
  minimumMatches: '0'
};

const positionKeys = ['carry', 'mid', 'offlane', 'soft_support', 'hard_support'];
const metricTabs = [
  ['metaScore', 'Meta Score'],
  ['winRate', 'Win Rate'],
  ['pickRate', 'Pick Rate'],
  ['matches', 'Matches'],
  ['confidenceScore', 'Confidence']
];

function formatDate(value) {
  if (!value) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value));
}

export default function Dashboard() {
  const [payload, setPayload] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [positionFilter, setPositionFilter] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('metaScore');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadData({ refresh = false } = {}) {
    const setBusy = refresh ? setRefreshing : setLoading;
    setBusy(true);
    setError('');

    try {
      const data = refresh ? await refreshHeroMeta() : await getHeroMeta();
      setPayload(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredHeroes = useMemo(() => {
    const heroes = payload?.heroes || [];
    const search = filters.search.trim().toLowerCase();
    const minimumMatches = Number(filters.minimumMatches) || 0;

    return heroes
      .filter((hero) => {
        const matchesSearch =
          !search ||
          hero.localizedName.toLowerCase().includes(search) ||
          hero.name.toLowerCase().includes(search);
        const matchesTier = filters.tier === 'all' || hero.tier === filters.tier;
        const matchesAttr =
          filters.primaryAttr === 'all' || hero.primaryAttr === filters.primaryAttr;
        const matchesAttack =
          filters.attackType === 'all' || hero.attackType === filters.attackType;
        const matchesPosition =
          positionFilter === 'all' || (hero.positions || []).includes(positionFilter);
        const matchesMinimum = hero.matches >= minimumMatches;

        return matchesSearch && matchesTier && matchesAttr && matchesAttack && matchesPosition && matchesMinimum;
      })
      .sort((a, b) => b[filters.sortBy] - a[filters.sortBy]);
  }, [payload, filters, positionFilter]);

  function selectMetric(metric) {
    setSelectedMetric(metric);
    setFilters((currentFilters) => ({
      ...currentFilters,
      sortBy: metric
    }));
  }

  const summary = useMemo(() => {
    const heroes = payload?.heroes || [];
    const topMeta = heroes[0];
    const topWinRate = [...heroes].sort((a, b) => b.winRate - a.winRate)[0];

    return {
      totalHeroes: payload?.totalHeroes || 0,
      topMeta,
      topWinRate
    };
  }, [payload]);

  const bestByPosition = useMemo(() => {
    const heroes = payload?.heroes || [];

    return positionKeys.reduce((acc, position) => {
      acc[position] = heroes
        .filter((hero) => (hero.positions || []).includes(position))
        .sort((a, b) => b.metaScore - a.metaScore)[0];

      return acc;
    }, {});
  }, [payload]);

  return (
    <main className="dashboard">
      <header className="hero-header">
        <div>
          <p className="eyebrow">OpenDota API + analise propria</p>
          <h1>DotaMeta Insights</h1>
          <p>
            Hero meta dashboard based on public Dota 2 data
          </p>
          <span className="header-note">
            Posicoes inferidas por heuristica de roles da OpenDota. Dados reais por partida
            ficam preparados para uma futura integracao STRATZ GraphQL.
          </span>
        </div>

        <button className="refresh-button" type="button" onClick={() => loadData({ refresh: true })} disabled={refreshing}>
          {refreshing ? 'Atualizando...' : 'Atualizar dados'}
        </button>
      </header>

      {error ? (
        <StatusMessage
          type="error"
          title="Erro ao carregar dados"
          message={error}
          actionLabel="Tentar novamente"
          onAction={() => loadData()}
        />
      ) : null}
      {payload?.warning ? (
        <StatusMessage type="warning" title="Dados em cache" message={payload.warning} />
      ) : null}

      {loading ? (
        <StatusMessage
          type="loading"
          title="Carregando dados do meta"
          message="Buscando estatisticas processadas pela API local."
        />
      ) : (
        <>
          <section className="meta-overview">
            <div className="section-heading">
              <div>
                <h2>Meta Overview</h2>
                <p>Switch the active metric to update the main ranking and table order.</p>
              </div>
            </div>

            <div className="metric-tabs" role="tablist" aria-label="Metric selector">
              {metricTabs.map(([metric, label]) => (
                <button
                  key={metric}
                  className={selectedMetric === metric ? 'active' : ''}
                  type="button"
                  onClick={() => selectMetric(metric)}
                >
                  {label}
                </button>
              ))}
            </div>

            <Suspense
              fallback={
                <StatusMessage
                  type="loading"
                  title="Loading charts"
                  message="Preparing the main ranking."
                />
              }
            >
              <HeroMetricRankingChart
                heroes={filteredHeroes}
                metric={selectedMetric}
                metricLabel={metricTabs.find(([metric]) => metric === selectedMetric)?.[1] || 'Meta Score'}
              />
            </Suspense>
          </section>

          <section className="summary-grid">
            <HeroCard label="Herois analisados" value={summary.totalHeroes} detail={payload?.source} />
            <HeroCard
              label="Melhor Meta Score"
              value={summary.topMeta?.localizedName || '-'}
              detail={summary.topMeta ? `${summary.topMeta.metaScore.toFixed(1)} pontos` : ''}
            />
            <HeroCard
              label="Maior Win Rate"
              value={summary.topWinRate?.localizedName || '-'}
              detail={summary.topWinRate ? `${summary.topWinRate.winRate.toFixed(2)}%` : ''}
            />
            <HeroCard label="Ultima atualizacao" value={formatDate(payload?.updatedAt)} detail="Cache local de 6 horas" />
          </section>

          <section className="charts-section">
            <div className="section-heading">
              <div>
                <h2>Graficos do meta</h2>
                <p>Leitura visual dos rankings, tiers e lideres por posicao.</p>
              </div>
            </div>

            <Suspense
              fallback={
                <StatusMessage
                  type="loading"
                  title="Loading charts"
                  message="Preparing the analytics visualizations."
                />
              }
            >
              <div className="charts-grid">
                <TopMetaScoreChart heroes={payload?.heroes || []} />
                <TopWinRateChart heroes={payload?.heroes || []} />
                <TierDistributionChart heroes={payload?.heroes || []} />
                <PositionLeadersChart leaders={bestByPosition} />
              </div>
            </Suspense>
          </section>

          <section className="position-leaders">
            <div className="section-heading">
              <div>
                <h2>Melhores por posicao</h2>
                <p>Ranking por Meta Score dentro das posicoes inferidas para esta primeira versao.</p>
              </div>
            </div>

            <div className="position-grid">
              {positionKeys.map((position) => {
                const hero = bestByPosition[position];

                return (
                  <article key={position} className="position-card">
                    <div className="position-card-top">
                      <HeroPositionBadge position={position} />
                      {hero ? <HeroTierBadge tier={hero.tier} /> : null}
                    </div>
                    <span className="position-card-label">Melhor {getPositionLabel(position)}</span>
                    {hero ? (
                      <>
                        <strong>{hero.localizedName}</strong>
                        <div className="position-card-stats">
                          <span>{hero.metaScore.toFixed(1)} score</span>
                          <span>{hero.winRate.toFixed(2)}% win</span>
                          <span>{new Intl.NumberFormat('pt-BR').format(hero.matches)} matches</span>
                        </div>
                      </>
                    ) : (
                      <strong>Sem dados</strong>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="about-project">
            <h2>About this project</h2>
            <p>
              This dashboard uses public OpenDota data, calculates a custom Meta Score, and
              presents inferred hero positions from OpenDota roles. It was built as an analytics,
              dashboard, and portfolio project. It does not scrape STRATZ, Dota2ProTracker, or any
              third-party website.
            </p>
          </section>

          <section className="data-notes">
            <h2>Data notes</h2>
            <ul>
              <li>OpenDota is the current data source.</li>
              <li>Positions are inferred from hero roles.</li>
              <li>Contest Rate and DotaMeta Rating are derived indicators.</li>
              <li>No scraping is used.</li>
              <li>STRATZ GraphQL integration is planned for more accurate position, patch and rank analytics.</li>
            </ul>
          </section>

          <Filters
            filters={filters}
            onChange={setFilters}
            positionFilter={positionFilter}
            onPositionChange={setPositionFilter}
          />
          <HeroTable heroes={filteredHeroes} />
        </>
      )}
    </main>
  );
}
