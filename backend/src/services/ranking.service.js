const DEFAULT_METRIC = 'metaScore';
const VALID_METRICS = ['metaScore', 'winRate', 'pickRate', 'matches'];
const POSITION_KEYS = ['carry', 'mid', 'offlane', 'soft_support', 'hard_support'];
const TIER_KEYS = ['S', 'A', 'B', 'C', 'D'];
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;

function normalizeMetric(metric) {
  return VALID_METRICS.includes(metric) ? metric : DEFAULT_METRIC;
}

function normalizeLimit(limit) {
  const parsedLimit = Number.parseInt(limit, 10);

  if (Number.isNaN(parsedLimit)) {
    return 10;
  }

  return Math.min(Math.max(parsedLimit, MIN_LIMIT), MAX_LIMIT);
}

function matchesPosition(hero, position) {
  if (!position) {
    return true;
  }

  return Array.isArray(hero.positions) && hero.positions.includes(position);
}

export function getTopHeroes(heroes, metric = DEFAULT_METRIC, limit = 10, position) {
  const selectedMetric = normalizeMetric(metric);
  const selectedLimit = normalizeLimit(limit);

  return [...heroes]
    .filter((hero) => matchesPosition(hero, position))
    .sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0))
    .slice(0, selectedLimit);
}

export function getBestHeroesByPosition(heroes) {
  return POSITION_KEYS.reduce((acc, position) => {
    acc[position] = getTopHeroes(heroes, DEFAULT_METRIC, 1, position)[0] || null;
    return acc;
  }, {});
}

export function getTierDistribution(heroes) {
  return heroes.reduce(
    (acc, hero) => {
      if (TIER_KEYS.includes(hero.tier)) {
        acc[hero.tier] += 1;
      }

      return acc;
    },
    { S: 0, A: 0, B: 0, C: 0, D: 0 }
  );
}

export function getHeroById(heroes, id) {
  return heroes.find((hero) => String(hero.id) === String(id)) || null;
}

export function isValidMetric(metric) {
  return !metric || VALID_METRICS.includes(metric);
}

export function isValidPosition(position) {
  return !position || POSITION_KEYS.includes(position);
}

export function getRankingOptions({ metric, limit, position } = {}) {
  return {
    metric: normalizeMetric(metric),
    limit: normalizeLimit(limit),
    position: position || null
  };
}
