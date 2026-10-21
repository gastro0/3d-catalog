const assert = require('node:assert/strict');
const { test } = require('node:test');

require('ts-node').register({
  skipProject: true,
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
    target: 'ES2020',
    jsx: 'react-jsx',
    experimentalDecorators: true,
  },
});
const {
  categories,
  purposes,
  features,
  licenses,
  softwareOptions,
} = require('../apps/web/features/catalog/categories.ts');
const {
  categoryCounts,
  filterModels,
  matchesSearch,
  readFilters,
} = require('../apps/web/features/catalog/catalog.logic.ts');
const {
  CATEGORIES,
  PURPOSES,
  FEATURES,
  LICENSES,
  SOFTWARE,
  validateModelUpload,
} = require('../apps/api/src/catalog/catalog.validation.ts');
const base = {
  id: 'one',
  name: 'Подставка',
  description: 'Для смартфона',
  category: 'Для дома',
  format: 'STL',
  tags: ['подарок'],
  file_size: 1024,
  created_at: '2026-10-21',
  purposes: ['printing', 'engineering'],
  features: ['support-free'],
  software: ['FreeCAD'],
  license: 'CC-BY-4.0',
};
const filters = (query = {}) => readFilters(query);
const file = {
  originalname: 'example.stl',
  buffer: Buffer.from('solid model'),
  size: 11,
};

test('all 19 categories, purposes, features and licenses agree between API and UI', () => {
  assert.equal(categories.length, 19);
  for (const [client, server] of [
    [categories.map((c) => c.ru), CATEGORIES],
    [purposes.map((p) => p.value), PURPOSES],
    [features.map((f) => f.value), FEATURES],
    [licenses.map((l) => l.value), LICENSES],
    [softwareOptions, SOFTWARE],
  ])
    assert.deepEqual([...client].sort(), [...server].sort());
});
test('legacy categories remain discoverable and included in real category counts', () => {
  assert.equal(filterModels([base], filters({ category: 'home' })).length, 1);
  assert.equal(filterModels([base], filters(), 'home').length, 1);
  assert.equal(categoryCounts([base]).home, 1);
});
test('search finds descriptions, tags, bilingual synonyms and ё', () => {
  assert.equal(matchesSearch(base, 'phone holder'), true);
  assert.equal(matchesSearch(base, 'подарок'), true);
  assert.equal(
    matchesSearch({ ...base, name: 'Ёлка', description: '' }, 'елка'),
    true,
  );
  assert.equal(matchesSearch(base, 'дракон'), false);
});
test('combined filters support several purposes without guessing purpose from STL', () => {
  assert.equal(
    filterModels(
      [base],
      filters({
        purpose: 'engineering',
        feature: 'support-free',
        software: 'FreeCAD',
        license: 'CC-BY-4.0',
        format: 'STL',
      }),
    ).length,
    1,
  );
  assert.equal(
    filterModels(
      [{ ...base, purposes: undefined }],
      filters({ purpose: 'printing' }),
    ).length,
    0,
  );
  assert.equal(
    filterModels([base], filters({ purpose: 'visualization' })).length,
    0,
  );
});
test('URL parsing ignores duplicate parameters and invalid sort', () => {
  assert.equal(filters({ q: ['a', 'b'], sort: 'malformed' }).q, '');
  assert.equal(filters({ sort: 'malformed' }).sort, 'date');
});
test('sort by size and name is deterministic and does not mutate source data', () => {
  const models = [
    base,
    { ...base, id: 'two', name: 'Адаптер', file_size: 100 },
  ];
  assert.equal(filterModels(models, filters({ sort: 'size' }))[0].id, 'two');
  assert.equal(filterModels(models, filters({ sort: 'name' }))[0].id, 'two');
  assert.equal(models[0].id, 'one');
});
test('multipart metadata accepts multiple purposes, deduplicates tags and normalizes old categories', () => {
  const model = validateModelUpload(file, {
    name: 'Деталь',
    category: 'Для дома',
    purposes: '["printing","engineering"]',
    tags: '["подарок","подарок"]',
    license: 'CC-BY-4.0',
  });
  assert.deepEqual(model.purposes, ['printing', 'engineering']);
  assert.deepEqual(model.tags, ['подарок']);
  assert.equal(model.category, 'Дом и быт');
  assert.deepEqual(
    validateModelUpload(file, { name: 'Деталь', category: 'Дом и быт' })
      .purposes,
    [],
  );
});
test('upload validation rejects malformed, unknown and oversized metadata', () => {
  const body = { name: 'Деталь', category: 'Дом и быт' };
  for (const patch of [
    { purposes: 'printing' },
    { purposes: '["unknown"]' },
    { purposes: '[null]' },
    { features: '["unverified-feature"]' },
    { tags: JSON.stringify(Array(13).fill('tag')) },
    { tags: JSON.stringify(['x'.repeat(41)]) },
    { license: 'all-rights-granted' },
    { dimensions: 'x'.repeat(161) },
    { software: '["Unknown CAD"]' },
    { category: '__proto__' },
  ])
    assert.throws(() => validateModelUpload(file, { ...body, ...patch }));
});

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const {
  RouterContext,
} = require('next/dist/shared/lib/router-context.shared-runtime');
const catalogHook = require('../apps/web/features/catalog/useCatalog.ts');
const preferencesHook = require('../apps/web/providers/PreferencesProvider.tsx');
const favoritesHook = require('../apps/web/providers/FavoritesProvider.tsx');
const authHook = require('../apps/web/providers/AuthProvider.tsx');
preferencesHook.usePreferences = () => ({
  lang: 'ru',
  theme: 'light',
  t: (ru) => ru,
  toggleLang() {},
  toggleTheme() {},
});
authHook.useAuth = () => ({ user: null, loading: false, openAuth() {} });
const { CatalogView } = require('../apps/web/features/catalog/CatalogView.tsx');
function renderCatalog({
  models = [],
  mode = 'all',
  query = {},
  error = '',
  ids = [],
} = {}) {
  catalogHook.useCatalog = () => ({
    models,
    loading: false,
    error,
    reload() {},
  });
  favoritesHook.useFavorites = () => ({ ids, toggle() {} });
  const router = {
    pathname: '/models',
    asPath: '/models',
    query,
    isReady: true,
    replace() {},
    push() {},
    prefetch: async () => {},
  };
  return renderToStaticMarkup(
    React.createElement(
      RouterContext.Provider,
      { value: router },
      React.createElement(CatalogView, { mode }),
    ),
  );
}
test('empty catalog offers upload without suggesting changing unused filters', () => {
  const html = renderCatalog();
  assert.match(html, /В каталоге пока нет моделей/);
  assert.match(html, /Добавить модель/);
  assert.doesNotMatch(html, /Сбросить фильтры/);
  assert.match(
    renderCatalog({ query: { q: '   ' } }),
    /В каталоге пока нет моделей/,
  );
});
test('empty favorites hide search and offer a catalog link', () => {
  const html = renderCatalog({ mode: 'favorites' });
  assert.match(html, /Здесь будут сохранённые модели/);
  assert.match(html, /Перейти в каталог/);
  assert.doesNotMatch(html, /aria-label="Поиск моделей"/);
});
test('failed search offers reset; failed request offers retry', () => {
  assert.match(
    renderCatalog({ models: [base], query: { q: 'дракон' } }),
    /Сбросить фильтры/,
  );
  assert.match(
    renderCatalog({ error: 'Сервис недоступен' }),
    /Не удалось загрузить модели/,
  );
  assert.match(renderCatalog({ error: 'Сервис недоступен' }), /Повторить/);
});
test('model cards show author-provided purposes and retain search in return links', () => {
  const html = renderCatalog({ models: [base], query: { q: 'подарок' } });
  assert.match(html, /Для 3D-печати/);
  assert.match(html, /Для проектирования/);
  assert.match(html, /from=%2Fmodels%3Fq%3D/);
});

const {
  CatalogService,
} = require('../apps/api/src/catalog/catalog.service.ts');
test('download uses the stored path and issues a 60-second download link', async () => {
  let signed;
  const storage = {
    createSignedUrl: async (...args) => {
      signed = args;
      return {
        data: { signedUrl: 'https://storage.example/download' },
        error: null,
      };
    },
  };
  const client = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: { id: 'one', storage_path: 'owner/one.stl' },
            error: null,
          }),
        }),
      }),
    }),
    storage: { from: () => storage },
  };
  const service = new CatalogService(
    { getClient: () => client },
    { get: () => 'models' },
  );
  assert.deepEqual(await service.download('one'), {
    url: 'https://storage.example/download',
  });
  assert.deepEqual(signed, ['owner/one.stl', 60, { download: true }]);
});
test('upload cleans up its file when metadata insertion fails', async () => {
  let inserted;
  let cleaned;
  const storage = {
    upload: async () => ({ error: null }),
    remove: async (paths) => {
      cleaned = paths;
      return { error: null };
    },
  };
  const client = {
    storage: { from: () => storage },
    from: () => ({
      insert: (row) => {
        inserted = row;
        return {
          select: () => ({
            single: async () => ({
              data: null,
              error: { message: 'unavailable' },
            }),
          }),
        };
      },
    }),
  };
  const service = new CatalogService(
    { getClient: () => client },
    { get: () => 'models' },
  );
  await assert.rejects(() =>
    service.create(
      file,
      {
        name: 'Деталь',
        category: 'Дом и быт',
        purposes: '["printing","engineering"]',
      },
      'owner',
    ),
  );
  assert.deepEqual(inserted.purposes, ['printing', 'engineering']);
  assert.deepEqual(cleaned, [inserted.storage_path]);
});
