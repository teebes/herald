import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { build } from 'esbuild';
import axios from 'axios';
import { createStore } from 'vuex';

// Bundle the real builder module without booting the browser router/root store.
const { outputFiles } = await build({
  absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
  entryPoints: ['src/store/modules/builder/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  plugins: [{
    name: 'isolate-builder',
    setup(build) {
      build.onResolve({ filter: /^@\/(router|store)$/ }, ({ path }) => ({ path, external: true }));
    },
  }],
  write: false,
});
const require = createRequire(import.meta.url);

const room = (id, name = `Room ${id}`) => ({ id, name, key: `room-${id}`, zone: { id: 1 } });

function createFixture() {
  const requests = [];
  // Deliberately allow cancelled requests to settle: correctness must not
  // depend on the transport stopping a response that is already on its way.
  const request = config => new Promise((resolve, reject) => {
    requests.push({ config, resolve, reject });
  });
  request.CancelToken = axios.CancelToken;
  request.isCancel = axios.isCancel;

  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputFiles[0].text)(
    name => {
      if (name === 'axios') return request;
      if (name === '@/router' || name === '@/store') return {};
      return require(name);
    },
    module,
    module.exports,
  );
  const store = createStore({ modules: { builder: module.exports.default } });
  store.commit('builder/world_set', { id: 1, factions: [] });
  store.commit('builder/zone_set', { id: 1 });
  store.commit('builder/room_set', room(0));

  const selections = [];
  store.subscribe(({ type }, state) => {
    if (type === 'builder/room_set' || type === 'builder/room_clear') {
      selections.push(state.builder.room?.id ?? null);
    }
  });

  const fetchRoom = (id, options = {}) => store.dispatch('builder/room_fetch', {
    world_id: 1, room_id: id, ...options,
  });
  return { store, requests, selections, fetchRoom };
}

for (const olderFinishesFirst of [true, false]) {
  test(`a previous view cannot override a map click (${olderFinishesFirst ? 'older' : 'newer'} response first)`, async () => {
    const { store, requests, selections, fetchRoom } = createFixture();
    // This uncancellable view load was the source of the original flicker.
    const firstView = fetchRoom(1);
    await store.dispatch('builder/room_select', room(2));
    const secondView = fetchRoom(2);
    assert.equal(store.state.builder.room.id, 2);

    if (olderFinishesFirst) {
      requests[0].resolve({ data: room(1) });
      assert.equal(await firstView, undefined);
      assert.deepEqual(selections, [2]);
    }

    const details = { ...room(2), description: 'Full details', map: {} };
    requests[2].resolve({ data: details });
    assert.equal((await secondView).description, 'Full details');
    assert.equal('map' in store.state.builder.room, false);

    if (!olderFinishesFirst) {
      requests[0].resolve({ data: room(1) });
      assert.equal(await firstView, undefined);
    }
    // The duplicate request from the same map click is also obsolete.
    requests[1].resolve({ data: room(2, 'Older details') });
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(selections, [2, 2]);
    assert.equal(store.state.builder.room.description, 'Full details');
  });
}

test('returning to the same room still ignores its original request', async () => {
  const { store, requests, selections, fetchRoom } = createFixture();
  const original = fetchRoom(1);
  const middle = fetchRoom(2);
  const latest = fetchRoom(1);
  requests[2].resolve({ data: room(1, 'Latest details') });
  await latest;
  requests[0].resolve({ data: room(1, 'Old details') });
  requests[1].resolve({ data: room(2) });
  assert.equal(await original, undefined);
  assert.equal(await middle, undefined);
  assert.deepEqual(selections, [1]);
  assert.equal(store.state.builder.room.name, 'Latest details');
});

test('an obsolete permission error cannot clear the new selection', async () => {
  const { store, requests, selections, fetchRoom } = createFixture();
  const original = fetchRoom(1);
  await store.dispatch('builder/room_select', room(2));
  requests[0].reject({ response: { status: 403 } });
  assert.equal(await original, undefined);
  assert.equal(store.state.builder.room.id, 2);
  assert.deepEqual(selections, [2]);
  requests[1].resolve({ data: room(2) });
  await new Promise(resolve => setImmediate(resolve));
});

test('a cancelled view cannot commit even when its response arrives', async () => {
  const { store, requests, selections, fetchRoom } = createFixture();
  const source = axios.CancelToken.source();
  const pending = fetchRoom(1, { cancelToken: source.token });
  source.cancel();
  requests[0].resolve({ data: room(1) });
  assert.equal(await pending, undefined);
  assert.equal(store.state.builder.room.id, 0);
  assert.deepEqual(selections, []);
});

test('resetting the builder invalidates requests from the previous visit', async () => {
  const { store, requests, selections, fetchRoom } = createFixture();
  const original = fetchRoom(1);
  await store.dispatch('builder/room_select', room(2));
  store.commit('builder/reset_state');
  assert.ok(requests[1].config.cancelToken.reason);
  const latest = fetchRoom(3);
  requests[0].resolve({ data: room(1) });
  requests[1].resolve({ data: room(2) });
  assert.equal(await original, undefined);
  assert.equal(store.state.builder.room, null);
  requests[2].resolve({ data: room(3) });
  await latest;
  assert.deepEqual(selections, [2, 3]);
});
