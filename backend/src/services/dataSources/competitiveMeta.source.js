export function getCompetitiveMetaSourceInfo() {
  return {
    name: 'Competitive Meta Preview',
    provider: 'Planned STRATZ/high MMR source',
    available: false,
    limitations: [
      'Not integrated yet',
      'No scraping is used',
      'No competitive data is invented'
    ]
  };
}

export function getCompetitiveMetaPreviewStatus() {
  return {
    available: false,
    reason: 'Competitive data source is not integrated yet.'
  };
}
