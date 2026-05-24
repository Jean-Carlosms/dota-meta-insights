import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
export const CACHE_FILE_PATH = join(__dirname, '..', 'data', 'heroMeta.cache.json');

export async function readCache() {
  try {
    const file = await readFile(CACHE_FILE_PATH, 'utf-8');
    const cache = JSON.parse(file);

    if (!cache.updatedAt || !Array.isArray(cache.data)) {
      return null;
    }

    return cache;
  } catch (error) {
    return null;
  }
}

export function isCacheValid(cache) {
  if (!cache?.updatedAt || !Array.isArray(cache.data)) {
    return false;
  }

  const updatedAtTime = new Date(cache.updatedAt).getTime();

  if (Number.isNaN(updatedAtTime)) {
    return false;
  }

  return Date.now() - updatedAtTime < CACHE_TTL_MS;
}

export async function writeCache(data) {
  const cache = {
    updatedAt: new Date().toISOString(),
    data
  };

  await mkdir(dirname(CACHE_FILE_PATH), { recursive: true });

  const tempPath = `${CACHE_FILE_PATH}.tmp`;
  await writeFile(tempPath, JSON.stringify(cache, null, 2), 'utf-8');
  await rename(tempPath, CACHE_FILE_PATH);

  return cache;
}
