import {
  getPositionLabels,
  getPrimaryPosition,
  inferHeroPositions
} from './position.service.js';
import { buildHeroAssetUrl } from './heroAssets.service.js';

const PICK_KEYS = [
  '1_pick',
  '2_pick',
  '3_pick',
  '4_pick',
  '5_pick',
  '6_pick',
  '7_pick',
  '8_pick',
  'pro_pick'
];

const WIN_KEYS = [
  '1_win',
  '2_win',
  '3_win',
  '4_win',
  '5_win',
  '6_win',
  '7_win',
  '8_win',
  'pro_win'
];

const SCORE_PROFILES = {
  balanced: {
    winRate: 0.5,
    pickRate: 0.2,
    confidence: 0.2,
    volume: 0.1
  },
  winrate_focused: {
    winRate: 0.65,
    pickRate: 0.15,
    confidence: 0.15,
    volume: 0.05
  },
  confidence_focused: {
    winRate: 0.4,
    pickRate: 0.2,
    confidence: 0.3,
    volume: 0.1
  }
};

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function sumKeys(hero, keys) {
  return keys.reduce((total, key) => total + toNumber(hero[key]), 0);
}

function round(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

export function calculateWinRate(wins, matches) {
  if (!matches) {
    return 0;
  }

  return round((wins / matches) * 100);
}

export function calculatePickRate(matches, totalMatches) {
  if (!totalMatches) {
    return 0;
  }

  return round((matches / totalMatches) * 100);
}

export function normalizeValue(value, min, max) {
  if (max <= min) {
    return 0;
  }

  return (value - min) / (max - min);
}

export function getScoreProfileWeights(scoreProfile = 'balanced') {
  return SCORE_PROFILES[scoreProfile] || SCORE_PROFILES.balanced;
}

export function calculateMetaScore({
  winRateNormalized,
  pickRateNormalized,
  confidenceNormalized = 0,
  volumeNormalized,
  scoreProfile = 'balanced'
}) {
  const weights = getScoreProfileWeights(scoreProfile);
  const score =
    winRateNormalized * weights.winRate +
    pickRateNormalized * weights.pickRate +
    confidenceNormalized * weights.confidence +
    volumeNormalized * weights.volume;

  return round(score * 100, 1);
}

export function classifyTier(score) {
  if (score >= 80) return 'S';
  if (score >= 65) return 'A';
  if (score >= 50) return 'B';
  if (score >= 35) return 'C';
  return 'D';
}

function getRange(items, key) {
  const values = items.map((item) => item[key]);

  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

export function calculateConfidenceScore(matches, maxMatches) {
  if (!matches || !maxMatches) {
    return 0;
  }

  return round(Math.min((matches / maxMatches) * 100, 100), 1);
}

export function getSampleSizeLabel(matches) {
  if (matches < 1000) {
    return 'Low sample';
  }

  if (matches <= 10000) {
    return 'Medium sample';
  }

  return 'High sample';
}

export function calculateContestRateApprox(pickRate) {
  return round(pickRate);
}

export function calculateRatingScore(metaScore, confidenceScore) {
  return round(metaScore * 0.75 + confidenceScore * 0.25, 1);
}

export function calculateLanePresenceApprox() {
  return null;
}

export function buildMetaPayload(rawHeroes, updatedAt, options = {}) {
  const scoreProfile = options.scoreProfile || 'balanced';
  const preparedHeroes = rawHeroes
    .filter((hero) => hero?.id && hero?.localized_name)
    .map((hero) => {
      const matches = sumKeys(hero, PICK_KEYS);
      const wins = sumKeys(hero, WIN_KEYS);
      const positions = inferHeroPositions(hero);
      const primaryPosition = getPrimaryPosition(hero);
      const positionLabels = getPositionLabels();

      return {
        id: hero.id,
        name: hero.name,
        localizedName: hero.localized_name,
        img: hero.img || null,
        icon: hero.icon || null,
        imageUrl: buildHeroAssetUrl(hero.img),
        iconUrl: buildHeroAssetUrl(hero.icon),
        primaryAttr: hero.primary_attr,
        attackType: hero.attack_type,
        roles: Array.isArray(hero.roles) ? hero.roles : [],
        positions,
        primaryPosition,
        positionLabel: positionLabels[primaryPosition],
        matches,
        wins,
        winRate: calculateWinRate(wins, matches),
        pickRate: 0,
        confidenceScore: 0,
        sampleSizeLabel: getSampleSizeLabel(matches)
      };
    });

  if (!preparedHeroes.length) {
    return {
      updatedAt,
      source: 'OpenDota API',
      scoreProfile,
      totalHeroes: 0,
      heroes: []
    };
  }

  const totalMatches = preparedHeroes.reduce((total, hero) => total + hero.matches, 0);

  const heroesWithPickRate = preparedHeroes.map((hero) => ({
    ...hero,
    pickRate: calculatePickRate(hero.matches, totalMatches)
  }));

  const winRateRange = getRange(heroesWithPickRate, 'winRate');
  const pickRateRange = getRange(heroesWithPickRate, 'pickRate');
  const volumeRange = getRange(heroesWithPickRate, 'matches');
  const maxMatches = volumeRange.max;

  const heroes = heroesWithPickRate
    .map((hero) => {
      const confidenceScore = calculateConfidenceScore(hero.matches, maxMatches);
      const metaScore = calculateMetaScore({
        winRateNormalized: normalizeValue(hero.winRate, winRateRange.min, winRateRange.max),
        pickRateNormalized: normalizeValue(hero.pickRate, pickRateRange.min, pickRateRange.max),
        confidenceNormalized: confidenceScore / 100,
        volumeNormalized: normalizeValue(hero.matches, volumeRange.min, volumeRange.max),
        scoreProfile
      });

      return {
        ...hero,
        confidenceScore,
        contestRateApprox: calculateContestRateApprox(hero.pickRate),
        metaScore,
        ratingScore: calculateRatingScore(metaScore, confidenceScore),
        lanePresenceApprox: calculateLanePresenceApprox(hero),
        tier: classifyTier(metaScore)
      };
    })
    .sort((a, b) => b.metaScore - a.metaScore);

  return {
    updatedAt,
    source: 'OpenDota API',
    scoreProfile,
    totalHeroes: heroes.length,
    heroes
  };
}
