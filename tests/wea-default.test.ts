import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import test from 'node:test';
import pg from 'pg';
import { modelEnvironment } from '../src/server/composition.ts';
import { createLedger } from '../src/server/ledger.ts';
import {
  weassistDefault,
  weassistDefaultMonthlyUsd,
  weassistDefaultTaskUsd,
  weassistLimits,
} from '../src/server/weassist-default.ts';
import { agentModels } from '../src/shared/model-defaults.ts';
import { weassistConnectionLabel } from '../src/shared/models.ts';

const hostedKey = 'fixture-weassist-hosted-h0st';

test('the WeAssist test key makes OpenRouter the server-side default', () => {
  const bootstrap = modelEnvironment({ WEA_DEFAULT_OPENROUTER_API_KEY: ` ${hostedKey} ` });
  assert.equal(bootstrap.provider, 'openrouter');
  assert.equal(bootstrap.model, agentModels.openrouter);
  assert.equal(bootstrap.weassistDefault, 'openrouter');
  assert.deepEqual(bootstrap.credentials.openrouter, { type: 'api_key', key: hostedKey });
  const chosen = modelEnvironment({
    WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey,
    WEA_DEFAULT_MODEL: 'anthropic/claude-opus-5.5',
  });
  assert.equal(chosen.model, 'anthropic/claude-opus-5.5');
});

test('without the WeAssist test key the existing setup is unchanged', () => {
  const plain = modelEnvironment({});
  assert.equal(plain.provider, 'openai');
  assert.equal(plain.weassistDefault, undefined);
  assert.equal(plain.credentials.openrouter, undefined);
  const blank = modelEnvironment({ WEA_DEFAULT_OPENROUTER_API_KEY: '  ' });
  assert.equal(blank.weassistDefault, undefined);
  const deployment = modelEnvironment({
    WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey,
    OPENROUTER_API_KEY: 'fixture-deployment-key',
  });
  assert.equal(deployment.weassistDefault, undefined);
  assert.deepEqual(deployment.credentials.openrouter, {
    type: 'api_key',
    key: 'fixture-deployment-key',
  });
  const explicit = modelEnvironment({
    WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey,
    LLM_PROVIDER: 'openai',
  });
  assert.equal(explicit.provider, 'openai');
  assert.equal(explicit.model, undefined);
});

test('the hosted key starts new owners on low spending caps', () => {
  assert.equal(weassistLimits({}), undefined);
  assert.deepEqual(weassistLimits({ WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey }), {
    monthlyUsd: weassistDefaultMonthlyUsd,
    taskUsd: weassistDefaultTaskUsd,
  });
  assert.deepEqual(
    weassistLimits({
      WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey,
      WEA_DEFAULT_MONTHLY_LIMIT_USD: '10',
      WEA_DEFAULT_TASK_LIMIT_USD: 'nope',
    }),
    { monthlyUsd: 10, taskUsd: weassistDefaultTaskUsd },
  );
  assert.ok(
    !JSON.stringify(weassistLimits({ WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey })).includes(
      hostedKey,
    ),
  );
  assert.equal(weassistDefault({ WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey })?.key, hostedKey);
});

test(
  'the hosted connection is labelled, hides its key, and yields to the owner’s own key',
  { skip: !process.env.TEST_DATABASE_URL, timeout: 30_000 },
  async (t) => {
    const { createModelService } = await import('../src/server/models.ts');
    const { createPiModelBackend } = await import('../src/providers/pi/models.ts');
    const schema = `test_wea_default_${randomUUID().replaceAll('-', '')}`;
    const root = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await root.query(`CREATE SCHEMA ${schema}`);
    const database = new pg.Pool({
      connectionString: process.env.TEST_DATABASE_URL,
      options: `-c search_path=${schema}`,
      max: 2,
    });
    const key = randomBytes(32);
    const base = createPiModelBackend({ fetch: async () => Response.json({ data: [] }) });
    const definitions = await base.catalog('openrouter', 'api_key');
    const backend = { ...base, catalog: async () => definitions };
    const service = createModelService({
      database,
      ownerId: 'fixture-wea-owner',
      keyStore: { id: 'fixture', configured: true, getKey: async () => key },
      backend,
      origin: 'http://127.0.0.1:4310',
      bootstrap: modelEnvironment({ WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey }),
    });
    t.after(async () => {
      await service.close();
      await database.end();
      await root.query(`DROP SCHEMA ${schema} CASCADE`);
      await root.end();
    });
    await service.initialize();
    const [hosted] = service.view().connections;
    assert.equal(hosted.label, weassistConnectionLabel);
    assert.equal(hosted.hosted, true);
    assert.equal(hosted.managed, true);
    assert.equal(hosted.keyEnding, undefined);
    assert.equal(service.view().selection?.connectionId, hosted.id);
    assert.equal(service.view().selection?.modelId, agentModels.openrouter);
    const ownKey = 'fixture-owner-openrouter-key';
    const ownId = await service.addKey('openrouter', ownKey);
    const view = service.view();
    assert.equal(view.selection?.connectionId, ownId);
    const own = view.connections.find((connection) => connection.id === ownId)!;
    assert.equal(own.hosted, undefined);
    assert.equal(own.keyEnding, ownKey.slice(-4));
    const visible = JSON.stringify(view);
    assert.ok(!visible.includes(hostedKey));
    assert.ok(!visible.includes(hostedKey.slice(-4)));
    const stored = JSON.stringify((await database.query('SELECT * FROM model_connections')).rows);
    assert.ok(!stored.includes(hostedKey));
    assert.ok(!stored.includes(ownKey));
  },
);

test(
  'new owners get the hosted caps only when the hosted key is active',
  { skip: !process.env.TEST_DATABASE_URL, timeout: 30_000 },
  async (t) => {
    const schema = `test_wea_limits_${randomUUID().replaceAll('-', '')}`;
    const admin = new pg.Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await admin.query(`CREATE SCHEMA ${schema}`);
    const pool = new pg.Pool({
      connectionString: process.env.TEST_DATABASE_URL,
      options: `-c search_path=${schema}`,
    });
    t.after(async () => {
      await pool.end();
      await admin.query(`DROP SCHEMA ${schema} CASCADE`);
      await admin.end();
    });
    await pool.query(
      'CREATE TABLE turns(id uuid PRIMARY KEY,owner_id text NOT NULL); CREATE TABLE preferences(owner_id text PRIMARY KEY,time_zone text,proactive_paused boolean DEFAULT false);',
    );
    for (const [ownerId, newOwnerLimits, expected] of [
      [
        'fixture-hosted-owner',
        weassistLimits({ WEA_DEFAULT_OPENROUTER_API_KEY: hostedKey }),
        [25, 2],
      ],
      ['fixture-plain-owner', undefined, [200, 5]],
    ] as const) {
      const ledger = createLedger({ pool, ownerId, newOwnerLimits });
      await ledger.initialize();
      const client = await pool.connect();
      try {
        await ledger.onboard(client);
      } finally {
        client.release();
      }
      const { rows } = await pool.query(
        'SELECT monthly_usd,task_usd FROM spending_limits WHERE owner_id=$1',
        [ownerId],
      );
      assert.deepEqual([rows[0].monthly_usd, rows[0].task_usd], expected);
    }
  },
);
