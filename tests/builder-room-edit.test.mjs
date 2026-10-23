import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { build } from 'esbuild';
import { parse, compileScript } from '@vue/compiler-sfc';
import { createRenderer, createSSRApp, h, nextTick } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createStore } from 'vuex';
import axios from 'axios';

// Exercise the actual room view, store, and form; isolate unrelated widgets.
const { outputFiles } = await build({
  absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
  stdin: {
    contents: `
      export { default as Room } from './src/views/builder/room/Room.vue';
      export { default as builder } from './src/store/modules/builder/index.ts';
      export { default as ui } from './src/store/modules/ui/index.ts';
    `,
    resolveDir: fileURLToPath(new URL('..', import.meta.url)),
  },
  bundle: true, platform: 'node', format: 'cjs', packages: 'external', write: false,
  plugins: [{ name: 'isolate-room-editor', setup(build) {
    build.onResolve({ filter: /^@\/(router|store)$/ }, ({ path }) => ({ path, external: true }));
    build.onResolve({ filter: /\/(Map|RoomDirActions|RoomDescription|Help|ReferenceField)\.vue$/ },
      ({ path }) => ({ path, namespace: 'widget' }));
    build.onLoad({ filter: /.*/, namespace: 'widget' }, () => ({
      contents: 'export default { render() { return null; } };', loader: 'js',
    }));
    build.onLoad({ filter: /\.vue$/ }, async ({ path }) => {
      const { descriptor } = parse(await readFile(path, 'utf8'), { filename: path });
      const id = createHash('sha256').update(path).digest('hex').slice(0, 8);
      return { contents: compileScript(descriptor, { id, inlineTemplate: true }).content, loader: 'ts' };
    });
  } }],
});
const require = createRequire(import.meta.url);
const room = (id = 2) => ({
  id, key: `room.${id}`, name: `Room ${id}`, type: 'indoor', zone: { id: 1 },
  x: id, y: 0, z: 0, description: '', note: '',
});
const settle = async () => { await new Promise(resolve => setImmediate(resolve)); await nextTick(); };

function fixture(t) {
  const requests = [];
  const request = config => new Promise((resolve, reject) => requests.push({ config, resolve, reject }));
  request.CancelToken = axios.CancelToken;
  request.isCancel = axios.isCancel;
  const listeners = new Map();
  const oldWindow = globalThis.window;
  globalThis.window = {
    addEventListener: (name, handler) => listeners.set(name, handler),
    removeEventListener: name => listeners.delete(name),
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', outputFiles[0].text)(name => {
    if (name === 'axios') return request;
    if (name === '@/router' || name === '@/store') return {};
    if (name === 'vue-router') return {
      useRoute: () => ({ params: { world_id: '1', room_id: '2' } }),
      useRouter: () => ({ push() {} }),
    };
    return require(name);
  }, module, module.exports);
  const { Room, builder, ui } = module.exports;
  const store = createStore({ modules: { builder, ui } });
  store.commit('builder/world_set', { id: 1, factions: [], builder_info: { builder_rank: 3 } });
  store.commit('builder/zone_set', { id: 1 });
  store.commit('builder/room_set', room());
  store.state.builder.map = {};

  // Minimal Vue host: retain rendered elements and handlers without a DOM dependency.
  const node = (type, text = '') => ({ type, text, props: {}, children: [], parent: null });
  const remove = child => {
    if (child.parent) child.parent.children.splice(child.parent.children.indexOf(child), 1);
    child.parent = null;
  };
  const renderer = createRenderer({
    createElement: node, createText: text => node('text', text), createComment: () => node('comment'),
    setText: (el, text) => { el.text = text; },
    setElementText: (el, text) => { el.text = text; el.children = []; },
    patchProp: (el, key, _old, value) => { el.props[key] = value; },
    parentNode: el => el.parent,
    nextSibling: el => el.parent?.children[el.parent.children.indexOf(el) + 1],
    insert: (el, parent, anchor) => {
      remove(el);
      el.parent = parent;
      parent.children.splice(anchor ? parent.children.indexOf(anchor) : parent.children.length, 0, el);
    },
    remove,
  });
  const root = node('root');
  const app = renderer.createApp(Room);
  app.use(store);
  app.component('router-link', { render: () => null });
  app.mount(root);
  let mounted = true;
  const unmount = () => { if (mounted) app.unmount(); mounted = false; };
  t.after(() => { unmount(); globalThis.window = oldWindow; });
  const find = (el, predicate) => predicate(el) ? el : el.children.map(child => find(child, predicate)).find(Boolean);
  const editButton = () => find(root, el => el.type === 'button' && el.props.class === 'btn-small mr-4');
  const pressE = () => listeners.get('keypress')({ keyCode: 101 });
  const formHtml = () => {
    const modal = store.state.ui.modal;
    return renderToString(createSSRApp({ render: () => h(modal.component, modal.props) }).use(store));
  };
  return { store, requests, editButton, pressE, unmount, formHtml };
}

for (const trigger of ['click', 'keyboard']) {
  test(`${trigger}: Edit waits for full details and retains the saved color`, async t => {
    const f = fixture(t);
    if (trigger === 'click') f.editButton().props.onClick();
    else f.pressE();
    await nextTick();
    assert.equal(f.store.state.ui.modal.isOpen, false);
    assert.equal(f.editButton().props.disabled, true);
    f.pressE();
    f.editButton().props.onClick();
    assert.equal(f.requests.length, 2, 'repeated Edit must not start more requests');
    f.requests[0].resolve({ data: { ...room(), color: '#111111', doors: {} } });
    await settle();
    assert.equal(f.store.state.ui.modal.isOpen, false, 'the obsolete mount request must not open Edit');
    f.requests[1].resolve({ data: { ...room(), color: '#336699', doors: {} } });
    await settle();
    assert.equal(f.store.state.ui.modal.props.data.color, '#336699');
    assert.match(await f.formHtml(), /id="field-color"[^>]*value="#336699"/);
    assert.equal(f.editButton().props.disabled, false);
  });
}

test('a room with no custom color still has an editable Color field', async t => {
  const f = fixture(t);
  f.editButton().props.onClick();
  f.requests.at(-1).resolve({ data: { ...room(), color: null, doors: {} } });
  await settle();
  assert.match(await f.formHtml(), /id="field-color"/);
});

test('selecting another room while Edit is loading does not open the old editor', async t => {
  const f = fixture(t);
  f.editButton().props.onClick();
  await f.store.dispatch('builder/room_select', room(3));
  f.requests[1].resolve({ data: { ...room(), color: 'red', doors: {} } });
  f.requests[2].resolve({ data: { ...room(3), color: 'blue', doors: {} } });
  await settle();
  assert.equal(f.store.state.ui.modal.isOpen, false);
  assert.equal(f.store.state.builder.room.id, 3);
});

test('leaving the room cancels the pending editor even if its response arrives', async t => {
  const f = fixture(t);
  f.editButton().props.onClick();
  f.unmount();
  assert.ok(f.requests.at(-1).config.cancelToken.reason);
  f.requests.at(-1).resolve({ data: { ...room(), color: 'red', doors: {} } });
  await settle();
  assert.equal(f.store.state.ui.modal.isOpen, false);
});

test('a failed detail request leaves Edit closed and allows retry', async t => {
  const f = fixture(t);
  f.editButton().props.onClick();
  f.requests.at(-1).reject(new Error('offline'));
  await settle();
  assert.equal(f.store.state.ui.modal.isOpen, false);
  assert.equal(f.editButton().props.disabled, false);
  f.editButton().props.onClick();
  f.requests.at(-1).resolve({ data: { ...room(), color: 'green', doors: {} } });
  await settle();
  assert.equal(f.store.state.ui.modal.props.data.color, 'green');
});

test('a pending Edit request does not replace another open dialog', async t => {
  const f = fixture(t);
  f.editButton().props.onClick();
  f.store.commit('ui/modal/open_view', { component: { render: () => null }, props: { title: 'Other dialog' } });
  f.requests.at(-1).resolve({ data: { ...room(), color: 'red', doors: {} } });
  await settle();
  assert.equal(f.store.state.ui.modal.props.title, 'Other dialog');
});
