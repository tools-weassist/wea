import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerSupportLink } from '../src/server/support.ts';
import { supportLink, supportLinkTarget, weaSupportDefault } from '../src/shared/support.ts';

test('the pilot support link defaults to WeAssist and accepts only https or mail links', () => {
  assert.deepEqual(supportLink(), {
    url: 'mailto:tools@weassist.io',
    label: 'WeAssist pilot support',
  });
  assert.deepEqual(supportLink('https://help.weassist.io/wea', 'Wea help desk'), {
    url: 'https://help.weassist.io/wea',
    label: 'Wea help desk',
  });
  assert.equal(supportLink('mailto:pilot@weassist.io').url, 'mailto:pilot@weassist.io');
  for (const unsafe of ['javascript:alert(1)', 'http://example.com', 'not a url', 'mailto:'])
    assert.equal(supportLink(unsafe).url, weaSupportDefault.url);
  assert.equal(supportLink(undefined, '   ').label, weaSupportDefault.label);
  assert.deepEqual(supportLinkTarget(weaSupportDefault), {});
  assert.deepEqual(supportLinkTarget(supportLink('https://help.weassist.io')), {
    target: '_blank',
    rel: 'noreferrer',
  });
});

test('the server serves the support link from WEA_SUPPORT_URL', async () => {
  const app = Fastify();
  registerSupportLink(app, { WEA_SUPPORT_URL: 'https://help.weassist.io/wea' });
  const response = await app.inject({ method: 'GET', url: '/api/support' });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.json(), {
    url: 'https://help.weassist.io/wea',
    label: 'WeAssist pilot support',
  });
  await app.close();
});
