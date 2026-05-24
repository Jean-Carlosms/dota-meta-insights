import { getHeroMeta } from '../../jobs/updateMeta.job.js';

export function getGeneralMetaSourceInfo() {
  return {
    name: 'General Meta',
    provider: 'OpenDota',
    available: true,
    limitations: [
      'Not restricted to high MMR/pro matches',
      'Positions are inferred from roles',
      'Derived indicators are approximations'
    ]
  };
}

export async function getGeneralMeta(options = {}) {
  return getHeroMeta(options);
}
