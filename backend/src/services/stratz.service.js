// Placeholder for a future STRATZ GraphQL integration.
// STRATZ can provide richer match-level metadata, including real hero positions by game.
// This module intentionally does not require STRATZ_API_TOKEN yet, so local development
// continues to work with OpenDota as the main public data source.
export async function fetchHeroPositionMeta() {
  if (!process.env.STRATZ_API_TOKEN) {
    return null;
  }

  throw new Error('STRATZ GraphQL integration is not implemented yet');
}
