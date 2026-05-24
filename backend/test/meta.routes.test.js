import assert from 'node:assert/strict';
import test from 'node:test';
import app from '../src/app.js';

test('GET /api/meta/source-info returns general and competitive source metadata', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/meta/source-info`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.activeSource, 'general');
    assert.equal(payload.sources.general.available, true);
    assert.equal(payload.sources.competitive_preview.available, false);
    assert.equal(payload.sources.competitive_preview.provider, 'Planned STRATZ/high MMR source');
  } finally {
    server.close();
  }
});
