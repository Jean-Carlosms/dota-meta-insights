import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getCompetitiveMetaPreviewStatus,
  getCompetitiveMetaSourceInfo
} from '../src/services/dataSources/competitiveMeta.source.js';

test('competitive meta source is an unavailable placeholder', () => {
  assert.deepEqual(getCompetitiveMetaPreviewStatus(), {
    available: false,
    reason: 'Competitive data source is not integrated yet.'
  });

  const info = getCompetitiveMetaSourceInfo();
  assert.equal(info.available, false);
  assert.equal(info.limitations.includes('No competitive data is invented'), true);
});
