import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateConfidenceScore,
  calculateContestRateApprox,
  calculateRatingScore,
  calculateWinRate,
  classifyTier,
  calculateLanePresenceApprox,
  getSampleSizeLabel
} from '../src/services/metaScore.service.js';

test('calculateWinRate returns percentage wins over matches', () => {
  assert.equal(calculateWinRate(52, 100), 52);
  assert.equal(calculateWinRate(0, 0), 0);
});

test('classifyTier maps score ranges to tiers', () => {
  assert.equal(classifyTier(82), 'S');
  assert.equal(classifyTier(70), 'A');
  assert.equal(classifyTier(58), 'B');
  assert.equal(classifyTier(40), 'C');
  assert.equal(classifyTier(20), 'D');
});

test('confidence and sample size are based on match volume', () => {
  assert.equal(calculateConfidenceScore(5000, 10000), 50);
  assert.equal(calculateConfidenceScore(10000, 10000), 100);
  assert.equal(getSampleSizeLabel(999), 'Low sample');
  assert.equal(getSampleSizeLabel(1000), 'Medium sample');
  assert.equal(getSampleSizeLabel(10001), 'High sample');
});

test('derived analytics metrics are explicit approximations', () => {
  assert.equal(calculateContestRateApprox(8.456), 8.46);
  assert.equal(calculateRatingScore(80, 60), 75);
  assert.equal(calculateLanePresenceApprox(), null);
});
