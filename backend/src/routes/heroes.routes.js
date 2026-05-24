import { Router } from 'express';
import { getGeneralMeta } from '../services/dataSources/generalMeta.source.js';
import {
  getBestHeroesByPosition,
  getHeroById,
  getHeroMetricsSummary,
  getRankingOptions,
  getTierDistribution,
  getTopHeroes,
  isValidMetric,
  isValidPosition
} from '../services/ranking.service.js';
import { createHttpError } from '../middlewares/error.middleware.js';

const router = Router();

function getScoreProfile(req) {
  return req.query.scoreProfile || 'balanced';
}

router.get('/meta', async (req, res, next) => {
  try {
    const payload = await getGeneralMeta({ scoreProfile: getScoreProfile(req) });
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.get('/meta/refresh', async (req, res, next) => {
  try {
    const payload = await getGeneralMeta({ forceRefresh: true, scoreProfile: getScoreProfile(req) });
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.get('/top', async (req, res, next) => {
  try {
    if (!isValidMetric(req.query.metric)) {
      throw createHttpError(
        'Invalid ranking metric',
        400,
        'Use one of: metaScore, winRate, pickRate, matches, confidenceScore, ratingScore, contestRateApprox'
      );
    }

    if (!isValidPosition(req.query.position)) {
      throw createHttpError(
        'Invalid position filter',
        400,
        'Use one of: carry, mid, offlane, soft_support, hard_support'
      );
    }

    const payload = await getGeneralMeta({ scoreProfile: getScoreProfile(req) });
    const options = getRankingOptions(req.query);
    const heroes = getTopHeroes(payload.heroes, options.metric, options.limit, options.position);

    res.json({
      updatedAt: payload.updatedAt,
      source: payload.source,
      metric: options.metric,
      limit: options.limit,
      position: options.position,
      totalHeroes: heroes.length,
      heroes
    });
  } catch (error) {
    next(error);
  }
});

router.get('/positions', async (req, res, next) => {
  try {
    const payload = await getGeneralMeta({ scoreProfile: getScoreProfile(req) });

    res.json({
      updatedAt: payload.updatedAt,
      source: payload.source,
      positions: getBestHeroesByPosition(payload.heroes)
    });
  } catch (error) {
    next(error);
  }
});

router.get('/tiers', async (req, res, next) => {
  try {
    const payload = await getGeneralMeta({ scoreProfile: getScoreProfile(req) });
    res.json(getTierDistribution(payload.heroes));
  } catch (error) {
    next(error);
  }
});

router.get('/metrics', async (req, res, next) => {
  try {
    const payload = await getGeneralMeta({ scoreProfile: getScoreProfile(req) });

    res.json({
      updatedAt: payload.updatedAt,
      source: payload.source,
      ...getHeroMetricsSummary(payload.heroes)
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const payload = await getGeneralMeta({ scoreProfile: getScoreProfile(req) });
    const hero = getHeroById(payload.heroes, req.params.id);

    if (!hero) {
      throw createHttpError(`Hero with id ${req.params.id} not found`, 404);
    }

    return res.json({
      updatedAt: payload.updatedAt,
      source: payload.source,
      hero
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
