import assert from 'node:assert/strict';
import test from 'node:test';
import { getPrimaryPosition, inferHeroPositions } from '../src/services/position.service.js';

test('infers carry and mid from carry heroes with escape or nuker roles', () => {
  const hero = {
    roles: ['Carry', 'Escape', 'Nuker']
  };

  assert.deepEqual(inferHeroPositions(hero), ['carry', 'mid', 'soft_support']);
  assert.equal(getPrimaryPosition(hero), 'carry');
});

test('infers support positions from support role', () => {
  const hero = {
    roles: ['Support', 'Disabler', 'Nuker']
  };

  assert.deepEqual(inferHeroPositions(hero), ['offlane', 'soft_support', 'hard_support']);
  assert.equal(getPrimaryPosition(hero), 'offlane');
});

test('falls back to unknown when roles are missing', () => {
  assert.deepEqual(inferHeroPositions({ roles: [] }), ['unknown']);
  assert.equal(getPrimaryPosition({}), 'unknown');
});
