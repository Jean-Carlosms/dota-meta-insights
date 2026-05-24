const STEAM_ASSET_BASE_URL = 'https://cdn.cloudflare.steamstatic.com';

export function buildHeroAssetUrl(assetPath) {
  if (!assetPath) {
    return null;
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${STEAM_ASSET_BASE_URL}${normalizedPath}`;
}
