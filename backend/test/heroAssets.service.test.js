import assert from 'node:assert/strict';
import test from 'node:test';
import { buildHeroAssetUrl } from '../src/services/heroAssets.service.js';
import { buildMetaPayload } from '../src/services/metaScore.service.js';

test('buildHeroAssetUrl builds absolute URL from relative path', () => {
  assert.equal(
    buildHeroAssetUrl('/apps/dota2/images/dota_react/heroes/antimage.png?'),
    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png?'
  );
});

test('buildHeroAssetUrl keeps absolute URLs unchanged', () => {
  const url = 'https://example.com/hero.png';
  assert.equal(buildHeroAssetUrl(url), url);
});

test('buildHeroAssetUrl returns null for missing values', () => {
  assert.equal(buildHeroAssetUrl(null), null);
  assert.equal(buildHeroAssetUrl(undefined), null);
  assert.equal(buildHeroAssetUrl(''), null);
});

test('processed hero includes raw and absolute asset URLs when img and icon exist', () => {
  const payload = buildMetaPayload(
    [
      {
        id: 1,
        name: 'npc_dota_hero_antimage',
        localized_name: 'Anti-Mage',
        primary_attr: 'agi',
        attack_type: 'Melee',
        roles: ['Carry'],
        img: '/apps/dota2/images/dota_react/heroes/antimage.png?',
        icon: '/apps/dota2/images/dota_react/heroes/icons/antimage.png?',
        '1_pick': 100,
        '1_win': 52
      }
    ],
    '2026-05-24T00:00:00.000Z'
  );

  assert.equal(payload.heroes[0].img, '/apps/dota2/images/dota_react/heroes/antimage.png?');
  assert.equal(payload.heroes[0].icon, '/apps/dota2/images/dota_react/heroes/icons/antimage.png?');
  assert.equal(
    payload.heroes[0].imageUrl,
    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png?'
  );
  assert.equal(
    payload.heroes[0].iconUrl,
    'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/antimage.png?'
  );
});
