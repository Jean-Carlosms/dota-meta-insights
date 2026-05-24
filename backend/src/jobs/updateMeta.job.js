import { fetchHeroStats } from '../services/opendota.service.js';
import { isCacheValid, readCache, writeCache } from '../services/cache.service.js';
import { buildMetaPayload } from '../services/metaScore.service.js';
import { createHttpError } from '../middlewares/error.middleware.js';

export async function getHeroMeta({ forceRefresh = false } = {}) {
  const cached = await readCache();

  if (!forceRefresh && isCacheValid(cached)) {
    return buildMetaPayload(cached.data, cached.updatedAt);
  }

  try {
    const rawHeroes = await fetchHeroStats();
    const freshCache = await writeCache(rawHeroes);

    return buildMetaPayload(freshCache.data, freshCache.updatedAt);
  } catch (error) {
    if (cached?.data?.length) {
      const payload = buildMetaPayload(cached.data, cached.updatedAt);

      return {
        ...payload,
        warning: `OpenDota refresh failed. Returning cached data. Reason: ${error.message}`
      };
    }

    throw createHttpError('Unable to load hero meta data from OpenDota', 503, error.message);
  }
}
