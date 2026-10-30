import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { build } from 'esbuild';
import { compileScript, parse } from '@vue/compiler-sfc';
import { createRenderer, nextTick } from 'vue';
import { createStore } from 'vuex';
import * as vueRouter from 'vue-router';

// Mount the real App and route table; views are inert so no API calls are made.
const { outputFiles } = await build({
  absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
  stdin: {
    contents: `
      export { default as App } from './src/App.vue';
      export { default as router } from './src/router/index.ts';
      export { getPageTitle } from './src/router/pageTitles.ts';
    `,
    resolveDir: fileURLToPath(new URL('..', import.meta.url)),
  },
  bundle: true, platform: 'node', format: 'cjs', packages: 'external', write: false,
  plugins: [{ name: 'isolate-page-titles', setup(build) {
    build.onResolve({ filter: /^@\/store$/ }, ({ path }) => ({ path, external: true }));
    build.onLoad({ filter: /\.vue$/ }, async ({ path }) => {
      if (!path.endsWith('/src/App.vue')) {
        // Named render also supports the bundled lazy import's module namespace.
        return { contents: 'export const render = () => null; export default { render };', loader: 'js' };
      }
      const { descriptor } = parse(await readFile(path, 'utf8'), { filename: path });
      return { contents: compileScript(descriptor, { id: 'app', inlineTemplate: true }).content, loader: 'ts' };
    });
  } }],
});
const require = createRequire(import.meta.url);

async function fixture(t, initialPath = '/') {
  const store = createStore({
    state: () => ({
      auth: { token: 'test-token', user: { is_staff: true } },
      ui: { notification: null, modal: { isOpen: false } },
      lobby: { world: null },
      game: { world: null, transfer_to: {}, room: null },
      builder: { world: null, room: null, zone: null, worlds: {}, zones: {} },
      staff: { nexus: null },
    }),
    getters: { isAuthenticated: state => !!state.auth.token },
    mutations: { 'ui/notification_set_error': () => {} },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputFiles[0].text)(name => {
    if (name === '@/store') return store;
    if (name === 'vue-router') return { ...vueRouter, createWebHistory: vueRouter.createMemoryHistory };
    return require(name);
  }, module, module.exports);
  const { App, router, getPageTitle } = module.exports;

  const titles = [];
  const oldDocument = globalThis.document;
  globalThis.document = {
    get title() { return titles.at(-1); },
    set title(value) { titles.push(value); },
  };

  // Minimal Vue host, matching the existing editor tests without adding a DOM dependency.
  const node = () => ({ children: [], parent: null });
  const remove = child => {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
    child.parent = null;
  };
  const renderer = createRenderer({
    createElement: node, createText: node, createComment: node,
    setText() {}, setElementText() {}, patchProp() {},
    parentNode: el => el.parent,
    nextSibling: el => el.parent?.children[el.parent.children.indexOf(el) + 1],
    insert: (el, parent, anchor) => {
      remove(el);
      el.parent = parent;
      parent.children.splice(anchor ? parent.children.indexOf(anchor) : parent.children.length, 0, el);
    },
    remove,
  });
  const app = renderer.createApp(App).use(store).use(router);
  await router.push(initialPath);
  await router.isReady();
  app.mount(node());
  t.after(() => { app.unmount(); globalThis.document = oldDocument; });

  const navigate = async path => { await router.push(path); await nextTick(); };
  const history = async delta => {
    await new Promise(resolve => {
      const stop = router.afterEach(() => { stop(); resolve(); });
      router.go(delta);
    });
    await nextTick();
  };
  return { store, router, getPageTitle, navigate, history, titles, title: () => titles.at(-1) };
}

test('homepage aliases, navigation, Back/Forward, and redirects update the actual document title', async t => {
  const f = await fixture(t);
  const homeTitle = 'Written Realms — Play & Create Text Adventures';
  assert.equal(f.title(), homeTitle);
  await f.navigate('/home');
  assert.equal(f.title(), homeTitle);
  await f.navigate('/lobby');
  assert.equal(f.title(), 'Lobby | Written Realms');
  await f.history(-1);
  assert.equal(f.title(), homeTitle);
  await f.history(1);
  assert.equal(f.title(), 'Lobby | Written Realms');
  await f.navigate('/terms');
  assert.equal(f.title(), 'Terms of Service | Written Realms');
  f.store.state.auth.token = null;
  await f.navigate('/build/worlds/1/admin');
  assert.equal(f.router.currentRoute.value.name, 'login');
  assert.equal(f.title(), 'Log In | Written Realms');
});

test('world overview titles follow loaded names and reject data from another route', async t => {
  const f = await fixture(t, '/worlds/1/edeus');
  assert.equal(f.title(), 'World Lobby | Written Realms');
  f.store.state.lobby.world = { id: 1, name: 'Edeus' };
  await nextTick();
  assert.equal(f.title(), 'Edeus — Text Adventure | Written Realms');
  await f.navigate('/worlds/2');
  assert.equal(f.title(), 'World Lobby | Written Realms');
  f.store.state.lobby.world = { id: 2, name: 'Another World' };
  await nextTick();
  assert.equal(f.title(), 'Another World — Text Adventure | Written Realms');
  await f.navigate('/lobby');
  f.store.state.lobby.world = { id: 1, name: 'Late Response' };
  await nextTick();
  assert.equal(f.title(), 'Lobby | Written Realms');
});

test('editor titles handle direct links, room selection, renames, and changing worlds', async t => {
  const f = await fixture(t, '/build/worlds/1/admin');
  assert.equal(f.title(), 'World Admin | Written Realms');
  f.store.state.builder.world = { id: 1, name: 'Edeus' };
  await nextTick();
  assert.equal(f.title(), 'Admin: Edeus | Written Realms');
  await f.navigate('/build/worlds/1');
  assert.equal(f.title(), 'Edit Edeus | Written Realms');
  f.store.state.builder.room = { id: 99, name: 'Previously Viewed Room' };
  await f.navigate('/build/worlds/1/rooms/42');
  assert.equal(f.title(), 'Room — Edeus Editor | Written Realms');
  f.store.state.builder.room = { id: 42, name: 'A Great Mess' };
  await nextTick();
  assert.equal(f.title(), 'A Great Mess — Edeus Editor | Written Realms');
  f.store.state.builder.room.name = 'A Tidy Room';
  await nextTick();
  assert.equal(f.title(), 'A Tidy Room — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/1/rooms/42/actions');
  assert.equal(f.title(), 'Actions: A Tidy Room — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/1/rooms/43');
  assert.equal(f.title(), 'Room — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/2/admin');
  assert.equal(f.title(), 'World Admin | Written Realms');
  f.store.state.builder.world = { id: 2, name: 'Another World' };
  await nextTick();
  assert.equal(f.title(), 'Admin: Another World | Written Realms');
});

test('zone and entity titles distinguish subjects without leaking cached names', async t => {
  const f = await fixture(t, '/build/worlds/1/zones/3/quests/4');
  Object.assign(f.store.state.builder, {
    world: { id: 1, name: 'Edeus' },
    zone: { id: 3, name: 'Alendel' },
    zones: { quest: { id: 4, name: 'Find the Key' } },
  });
  await nextTick();
  assert.equal(f.title(), 'Quest: Find the Key — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/1/zones/3/quests/5');
  assert.equal(f.title(), 'Quest — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/1/zones/3/rooms');
  assert.equal(f.title(), 'Rooms: Alendel — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/1/zones/9/rooms');
  assert.equal(f.title(), 'Rooms — Edeus Editor | Written Realms');
  f.store.state.builder.worlds.mob_template = { id: 7, name: 'a guard' };
  await f.navigate('/build/worlds/1/mobs/7');
  assert.equal(f.title(), 'Mob: a guard — Edeus Editor | Written Realms');
  await f.navigate('/build/worlds/1/mobs/8');
  assert.equal(f.title(), 'Mob — Edeus Editor | Written Realms');
});

test('game title stays stable during movement and follows world transfers', async t => {
  const f = await fixture(t, '/game');
  assert.equal(f.title(), 'Game | Written Realms');
  f.store.state.game.world = { id: 1, name: 'Edeus' };
  await nextTick();
  assert.equal(f.title(), 'Edeus | Written Realms');
  const writes = f.titles.length;
  f.store.state.game.room = { id: 42, name: 'A Great Mess' };
  await nextTick();
  assert.equal(f.titles.length, writes, 'movement must not rewrite the tab title');
  f.store.state.game.transfer_to = { world_name: 'The Dungeon' };
  await nextTick();
  assert.equal(f.title(), 'The Dungeon | Written Realms');
  f.store.state.game.world = { id: 2, name: 'The Dungeon' };
  f.store.state.game.transfer_to = {};
  await nextTick();
  assert.equal(f.title(), 'The Dungeon | Written Realms');
  await f.navigate('/lobby');
  assert.equal(f.title(), 'Lobby | Written Realms');
});

test('every registered named view has a contextual title, including on a fresh direct load', async t => {
  const f = await fixture(t);
  for (const record of f.router.getRoutes().filter(route => route.name)) {
    const params = Object.fromEntries([...record.path.matchAll(/:([a-z_]+)/g)].map(([, param]) => [param, '1']));
    const route = f.router.resolve({ name: record.name, params });
    const title = f.getPageTitle(route, {});
    assert.notEqual(title, 'Written Realms', `${record.name} needs a title`);
    assert.doesNotMatch(title, /undefined|null|\[object Object\]/, record.name);
    if (!['home', 'homedirect'].includes(record.name)) {
      assert.ok(title.endsWith(' | Written Realms'), record.name);
      assert.ok(!title.includes('Play & Create'), record.name);
    }
  }
  for (const [path, title] of [
    ['/lobby/public', 'Public Worlds | Written Realms'],
    ['/lobby/toString', 'Lobby | Written Realms'],
    ['/staff', 'Staff Panel | Written Realms'],
    ['/wot/guide', 'Wheel of Time | Written Realms'],
    ['/unknown', 'Written Realms'],
  ]) {
    assert.equal(f.getPageTitle({ path, params: { section: path.split('/').at(-1) }, name: path.startsWith('/lobby/') ? 'lobby_section' : undefined }, {}), title);
  }
});
