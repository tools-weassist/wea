import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { createDesktopAnalytics } from '../main/analytics.mjs';

test('Wea desktop analytics stay off by default, even when packaged', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'wea-analytics-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const configuration = (env, packaged) =>
    createDesktopAnalytics(join(root, `id-${packaged}-${env.NOD_ANALYTICS_ENABLED ?? 'unset'}`), {
      packaged,
      env,
    })();
  assert.equal((await configuration({}, true)).enabled, false);
  assert.equal((await configuration({}, false)).enabled, false);
  assert.equal((await configuration({ NOD_ANALYTICS_ENABLED: 'false' }, true)).enabled, false);
  assert.equal((await configuration({ NOD_ANALYTICS_ENABLED: 'true' }, true)).enabled, true);
});
