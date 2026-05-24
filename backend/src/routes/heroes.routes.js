import { Router } from 'express';
import { getHeroMeta } from '../jobs/updateMeta.job.js';
import {
  getBestHeroesByPosition,
  getHeroById,
  getRankingOptions,
  getTierDistribution,
  getTopHeroes,
  isValidMetric,
  isValidPosition
} from '../services/ranking.service.js';
import { createHttpError } from '../middlewares/error.middleware.js';

const router = Router();

router.get('/meta', async (req, res, next) => {
  try {
    const payload = await getHeroMeta();
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.get('/meta/refresh', async (req, res, next) => {
  try {
    const payload = await getHeroMeta({ forceRefresh: true });
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
        'Use one of: metaScore, winRate, pickRate, matches'
      );
    }

    if (!isValidPosition(req.query.position)) {
      throw createHttpError(
        'Invalid position filter',
        400,
        'Use one of: carry, mid, offlane, soft_support, hard_support'
      );
    }

    const payload = await getHeroMeta();
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
    const payload = await getHeroMeta();

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
    const payload = await getHeroMeta();
    res.json(getTierDistribution(payload.heroes));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const payload = await getHeroMeta();
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
