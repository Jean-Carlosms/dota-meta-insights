const OPENDOTA_BASE_URL = process.env.OPENDOTA_BASE_URL || 'https://api.opendota.com/api';
const HERO_STATS_URL = `${OPENDOTA_BASE_URL.replace(/\/$/, '')}/heroStats`;

const DEFAULT_TIMEOUT_MS = 10000;

export async function fetchHeroStats() {
  const timeoutMs = Number(process.env.OPENDOTA_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(HERO_STATS_URL, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenDota API returned status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('OpenDota API returned an unexpected payload');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`OpenDota API request timed out after ${timeoutMs}ms`);
    }

    throw new Error(`Failed to fetch OpenDota hero stats: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}
