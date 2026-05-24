import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getBestHeroesByPosition,
  getHeroById,
  getTierDistribution,
  getTopHeroes
} from '../src/services/ranking.service.js';

const heroes = [
  {
    id: 1,
    localizedName: 'Anti-Mage',
    positions: ['carry'],
    tier: 'A',
    metaScore: 72,
    winRate: 52,
    pickRate: 8,
    matches: 10000
  },
  {
    id: 2,
    localizedName: 'Axe',
    positions: ['offlane'],
    tier: 'B',
    metaScore: 64,
    winRate: 55,
    pickRate: 5,
    matches: 7000
  },
  {
    id: 3,
    localizedName: 'Puck',
    positions: ['mid', 'soft_support'],
    tier: 'S',
    metaScore: 84,
    winRate: 53,
    pickRate: 10,
    matches: 12000
  }
];

test('getTopHeroes ranks by metaScore by default', () => {
  const result = getTopHeroes(heroes);

  assert.equal(result[0].localizedName, 'Puck');
  assert.equal(result[1].localizedName, 'Anti-Mage');
});

test('getTopHeroes filters by position and metric', () => {
  const result = getTopHeroes(heroes, 'winRate', 10, 'offlane');

  assert.equal(result.length, 1);
  assert.equal(result[0].localizedName, 'Axe');
});

test('getTierDistribution counts heroes by tier', () => {
  assert.deepEqual(getTierDistribution(heroes), {
    S: 1,
    A: 1,
    B: 1,
    C: 0,
    D: 0
  });
});

test('getHeroById finds heroes by numeric or string id', () => {
  assert.equal(getHeroById(heroes, '2').localizedName, 'Axe');
  assert.equal(getHeroById(heroes, 99), null);
});

test('getBestHeroesByPosition returns one leader per known position', () => {
  const result = getBestHeroesByPosition(heroes);

  assert.equal(result.carry.localizedName, 'Anti-Mage');
  assert.equal(result.mid.localizedName, 'Puck');
  assert.equal(result.hard_support, null);
});
