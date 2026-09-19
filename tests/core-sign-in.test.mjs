import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const { outputFiles } = await build({
  absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
  entryPoints: ['src/core/coreSignIn.ts'], bundle: true,
  platform: 'node', format: 'cjs', write: false,
});
const module = { exports: {} };
new Function('module', 'exports', outputFiles[0].text)(module, module.exports);
const { safeLoginRedirect, coreAuthorizationRequest, authorizeCore } = module.exports;

const params = {
  response_type: 'code', client_id: 'wr-core',
  redirect_uri: 'https://core.example.test/auth/wr1/callback',
  state: 'state-with-sufficient-randomness-1234',
  code_challenge: 'c'.repeat(43), code_challenge_method: 'S256',
};

test('login preserves the complete local handoff destination', () => {
  const path = '/auth/core/authorize?' + new URLSearchParams(params).toString();
  assert.equal(safeLoginRedirect(path), path);
  for (const invalid of [undefined, ['//evil.example'], 'https://evil.example',
    '//evil.example', '/\\evil.example', '/\n/evil.example']) {
    assert.equal(safeLoginRedirect(invalid), '/lobby');
  }
});

test('handoff requires one value for every parameter and S256', () => {
  assert.deepEqual(coreAuthorizationRequest(params), params);
  for (const key of Object.keys(params)) {
    const missing = { ...params };
    delete missing[key];
    assert.throws(() => coreAuthorizationRequest(missing));
    assert.throws(() => coreAuthorizationRequest({ ...params, [key]: [params[key], params[key]] }));
  }
  assert.throws(() => coreAuthorizationRequest({ ...params, code_challenge_method: 'plain' }));
  assert.throws(() => coreAuthorizationRequest({ ...params, code_challenge: 'short' }));
  assert.throws(() => coreAuthorizationRequest({ ...params, state: 'short' }));
});

test('handoff calls only WR1 and navigates with an opaque code', async () => {
  const target = params.redirect_uri + '?' + new URLSearchParams({ code: 'a'.repeat(43), state: params.state });
  const calls = [];
  const result = await authorizeCore({ ...params, email: 'attacker@example.test' }, async (...args) => {
    calls.push(args);
    return { data: { redirect_url: target } };
  });
  assert.deepEqual(calls, [['auth/core/authorize/', params]]);
  assert.equal(result, target);
  assert.ok(!result.includes('jwt'));
});

test('handoff refuses swapped state, callback or missing code', async () => {
  for (const target of [
    'https://evil.example/?code=' + 'a'.repeat(43) + '&state=' + params.state,
    params.redirect_uri + '?code=' + 'a'.repeat(43) + '&state=swapped',
    params.redirect_uri + '?state=' + params.state,
  ]) {
    await assert.rejects(authorizeCore(params, async () => ({ data: { redirect_url: target } })));
  }
});

test('failed and disabled requests never produce a navigation', async () => {
  for (const status of [401, 403, 404]) {
    const failure = Object.assign(new Error('rejected'), { response: { status } });
    await assert.rejects(authorizeCore(params, async () => { throw failure; }), error => error === failure);
  }
});
