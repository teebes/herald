import assert from 'node:assert/strict';
import { test } from 'node:test';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { outputFiles } = await build({
  absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
  entryPoints: ['src/store/modules/auth.ts'], bundle: true,
  platform: 'node', format: 'cjs', packages: 'external', write: false,
  plugins: [{ name: 'isolate-auth', setup(build) {
    build.onResolve({ filter: /^@\/(router|config)$/ }, ({ path }) => ({ path, external: true }));
  }}],
});
const require = createRequire(import.meta.url);

function fixture(post) {
  globalThis.localStorage = { getItem: () => null };
  const module = { exports: {} };
  const navigations = [];
  new Function('require', 'module', 'exports', outputFiles[0].text)(name => {
    if (name === 'axios') return { post };
    if (name === '@/router') return { push: value => navigations.push(value) };
    if (name === '@/config') return { API_BASE: '/forge/api/v1/' };
    return require(name);
  }, module, module.exports);
  const commits = [];
  const context = { commit: (...args) => commits.push(args), dispatch: () => {} };
  return { actions: module.exports.default.actions, context, commits, navigations };
}

test('password login signals success only after receiving credentials', async () => {
  const f = fixture(async () => ({ data: { token: 'access', user: { id: 1 } } }));
  assert.equal(await f.actions.login(f.context, {}), true);
  assert.deepEqual(f.commits.slice(0, 2), [['auth_set', 'access'], ['user_set', { id: 1 }]]);
});

test('bad credentials and network failures stay on the login form', async () => {
  for (const failure of [new Error('offline'), { response: { data: { non_field_errors: ['Invalid credentials.'] } } }]) {
    const f = fixture(async () => { throw failure; });
    assert.equal(await f.actions.login(f.context, {}), false);
    assert.ok(f.commits.some(([mutation]) => mutation === 'auth_clear'));
    assert.deepEqual(f.navigations, []);
  }
});

test('expired confirmation reports failure without navigating or accepting tokens', async () => {
  const f = fixture(async () => { throw { response: { data: { code: ['Expired.'] } } }; });
  assert.equal(await f.actions.confirmemail(f.context, { code: 'old' }), false);
  assert.deepEqual(f.navigations, []);
  assert.ok(!f.commits.some(([mutation]) => mutation === 'auth_set'));
});

test('confirming while authenticated preserves a token omitted by the API', async () => {
  const f = fixture(async () => ({ status: 201, data: { token: null, user: { id: 1 } } }));
  assert.equal(await f.actions.confirmemail(f.context, { code: 'valid' }), true);
  assert.ok(!f.commits.some(([mutation]) => mutation === 'auth_set'));
  assert.deepEqual(f.navigations, [{ name: 'lobby' }]);
});

test('resend throttling exposes the server delay without reporting a send', async () => {
  const f = fixture(async () => { throw {
    response: { status: 429, headers: { 'retry-after': '3420' }, data: { detail: 'Throttled.' } },
  }; });
  assert.deepEqual(await f.actions.resendemailconfirmation(f.context, {}),
    { success: false, retryAfter: 3420 });
  assert.ok(!f.commits.some(([mutation]) => mutation === 'ui/notification_set'));
});

test('successful resend starts cooldown and network failures remain retryable', async () => {
  const sent = fixture(async () => ({ status: 201 }));
  assert.deepEqual(await sent.actions.resendemailconfirmation(sent.context, {}),
    { success: true, retryAfter: 60 });
  const offline = fixture(async () => { throw new Error('offline'); });
  assert.deepEqual(await offline.actions.resendemailconfirmation(offline.context, {}),
    { success: false, retryAfter: 0 });
});

test('password reset shows acknowledgement only for accepted requests', async () => {
  const accepted = fixture(async () => ({ status: 201 }));
  assert.equal(await accepted.actions.forgotpassword(accepted.context, {}), true);
  const limited = fixture(async () => { throw { response: { status: 429 } }; });
  assert.equal(await limited.actions.forgotpassword(limited.context, {}), false);
});
