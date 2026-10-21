import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useId, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useFavorites } from '../../providers/FavoritesProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { SortOption } from '../../types/model';
import { Icon } from '../../components/ui/Icon';
import { FilterSelect } from '../../components/ui/FilterSelect';
import {
  categories,
  Category,
  features,
  findCategory,
  formats,
  licenses,
  metadataLabel,
  purposes,
  softwareOptions,
} from './categories';
import {
  categoryCounts,
  FilterKey,
  filterKeys,
  filterModels,
  normalizeSearch,
  readFilters,
} from './catalog.logic';
import { AddModelButton } from './AddModelButton';
import { ModelCard } from './ModelCard';
import { useCatalog } from './useCatalog';

export function CatalogView({
  category,
  mode = 'all',
}: {
  category?: Category;
  mode?: 'all' | 'favorites' | 'mine';
}) {
  const router = useRouter();
  const { lang, t } = usePreferences();
  const { user } = useAuth();
  const { ids } = useFavorites();
  const { models, loading, error, reload } = useCatalog();
  const suggestionId = useId();
  const filters = readFilters(router.query);
  const [search, setSearch] = useState(filters.q);
  useEffect(() => setSearch(filters.q), [filters.q]);
  useEffect(() => {
    if (!router.isReady || search === filters.q) return;
    const timer = setTimeout(() => update('q', search), 250);
    return () => clearTimeout(timer);
  }, [search, filters.q, router.isReady, router.asPath]);
  const effectiveFilters = { ...filters, q: search };
  const scoped = models.filter(
    (model) =>
      (mode !== 'favorites' || ids.includes(model.id)) &&
      (mode !== 'mine' || model.owner_id === user?.id),
  );
  const filtered = filterModels(scoped, effectiveFilters, category?.slug);
  const counts = categoryCounts(scoped);
  const hasFilters = filterKeys.some(
    (key) => key !== 'sort' && !!effectiveFilters[key].trim(),
  );
  const showFilters =
    mode !== 'favorites' ||
    loading ||
    !!error ||
    scoped.length > 0 ||
    hasFilters;
  const options = (
    items: readonly { value: string; ru: string; en: string }[],
  ) => items.map((item) => ({ value: item.value, label: item[lang] }));
  function update(key: FilterKey, value: string) {
    const query = { ...router.query };
    if (search) query.q = search;
    else delete query.q;
    if (value && !(key === 'sort' && value === 'date')) query[key] = value;
    else delete query[key];
    void router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  }
  function reset() {
    setSearch('');
    const query = { ...router.query };
    for (const key of filterKeys) delete query[key];
    void router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
      scroll: false,
    });
  }
  const active: { key: FilterKey; label: string }[] = [
    { key: 'q', label: search },
    {
      key: 'category',
      label: findCategory(filters.category)?.[lang] || filters.category,
    },
    { key: 'purpose', label: metadataLabel(purposes, filters.purpose, lang) },
    { key: 'format', label: filters.format },
    { key: 'feature', label: metadataLabel(features, filters.feature, lang) },
    { key: 'license', label: metadataLabel(licenses, filters.license, lang) },
    { key: 'software', label: filters.software },
  ].filter((item) => !!item.label.trim()) as {
    key: FilterKey;
    label: string;
  }[];
  const suggestions = [
    ...new Set(scoped.flatMap((model) => [model.name, ...(model.tags || [])])),
  ]
    .filter(
      (value) =>
        !filters.q ||
        normalizeSearch(value).includes(normalizeSearch(filters.q)),
    )
    .slice(0, 8);
  const quickCategories = categories
    .filter((item) => counts[item.slug] > 0)
    .slice(0, 5);
  const returnParams = new URLSearchParams(router.asPath.split('?')[1] || '');
  if (search) returnParams.set('q', search);
  else returnParams.delete('q');
  const returnTo = `${router.asPath.split('?')[0]}${
    returnParams.size ? `?${returnParams}` : ''
  }`;

  return (
    <section aria-label={t('Каталог моделей', 'Model catalog')}>
      {showFilters && (
        <>
          <div className="catalog-filters">
            <label className="search-field">
              <Icon name="search" />
              <input
                type="search"
                aria-label={t('Поиск моделей', 'Search models')}
                placeholder={t(
                  'Название, описание или тег',
                  'Name, description or tag',
                )}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                list={suggestionId}
              />
              <datalist id={suggestionId}>
                {suggestions.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </label>
            {!category && (
              <FilterSelect
                label={t('Категория', 'Category')}
                value={filters.category}
                onChange={(value) => update('category', value)}
                options={[
                  { value: '', label: t('Все категории', 'All categories') },
                  ...categories
                    .filter(
                      (item) =>
                        counts[item.slug] > 0 ||
                        item.slug === filters.category ||
                        !scoped.length,
                    )
                    .map((item) => ({ value: item.slug, label: item[lang] })),
                ]}
              />
            )}
            <FilterSelect
              label={t('Назначение', 'Purpose')}
              value={filters.purpose}
              onChange={(value) => update('purpose', value)}
              options={[
                { value: '', label: t('Любое назначение', 'Any purpose') },
                ...options(purposes),
              ]}
            />
            <FilterSelect
              label={t('Формат', 'Format')}
              value={filters.format}
              onChange={(value) => update('format', value)}
              options={[
                { value: '', label: t('Все форматы', 'All formats') },
                ...formats.map((value) => ({ value, label: value })),
              ]}
            />
            <FilterSelect<SortOption>
              label={t('Сортировка', 'Sort order')}
              value={filters.sort}
              onChange={(value) => update('sort', value)}
              options={[
                { value: 'date', label: t('Сначала новые', 'Newest first') },
                { value: 'name', label: t('По названию', 'By name') },
                {
                  value: 'size',
                  label: t('Сначала небольшие', 'Smallest first'),
                },
              ]}
            />
          </div>
          <details
            className="extra-filters"
            open={
              !!(filters.feature || filters.license || filters.software) ||
              undefined
            }
          >
            <summary>{t('Дополнительные фильтры', 'More filters')}</summary>
            <div className="extra-filters-grid">
              <FilterSelect
                label={t('Особенности', 'Features')}
                value={filters.feature}
                onChange={(value) => update('feature', value)}
                options={[
                  { value: '', label: t('Любые особенности', 'Any features') },
                  ...options(features),
                ]}
              />
              <FilterSelect
                label={t('Лицензия', 'License')}
                value={filters.license}
                onChange={(value) => update('license', value)}
                options={[
                  { value: '', label: t('Любая лицензия', 'Any license') },
                  ...options(licenses),
                ]}
              />
              <FilterSelect
                label={t('Совместимость', 'Software compatibility')}
                value={filters.software}
                onChange={(value) => update('software', value)}
                options={[
                  { value: '', label: t('Любая программа', 'Any software') },
                  ...softwareOptions.map((value) => ({ value, label: value })),
                ]}
              />
            </div>
          </details>
        </>
      )}
      {!!active.length && (
        <div
          className="active-filters"
          aria-label={t('Выбранные фильтры', 'Active filters')}
        >
          {active.map(({ key, label }) => (
            <button
              key={key}
              className="filter-chip"
              onClick={() => update(key, '')}
              aria-label={`${t('Убрать фильтр', 'Remove filter')}: ${label}`}
            >
              {label}
              <Icon name="close" width="14" height="14" />
            </button>
          ))}
          <button className="text-button" onClick={reset}>
            {t('Сбросить всё', 'Reset all')}
          </button>
        </div>
      )}
      {mode === 'all' &&
        !category &&
        !hasFilters &&
        !!quickCategories.length && (
          <div className="quick-categories">
            <span>{t('Посмотрите', 'Explore')}</span>
            {quickCategories.map((item) => (
              <Link key={item.slug} href={`/categories/${item.slug}`}>
                {item[lang]} <span>{counts[item.slug]}</span>
              </Link>
            ))}
          </div>
        )}
      {error ? (
        <div className="empty-state" role="alert">
          <Icon name="cube" width="44" height="44" />
          <h2>{t('Не удалось загрузить модели', 'Unable to load models')}</h2>
          <p>{error}</p>
          <button className="button button-secondary" onClick={reload}>
            {t('Повторить', 'Retry')}
          </button>
        </div>
      ) : loading ? (
        <div
          className="model-grid"
          aria-busy="true"
          aria-label={t('Загрузка моделей', 'Loading models')}
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div className="skeleton-card" key={index} />
          ))}
        </div>
      ) : (
        <>
          {(scoped.length > 0 || hasFilters) && (
            <div className="results-meta" role="status">
              <span>
                {t('Моделей найдено', 'Models found')}: {filtered.length}
              </span>
              <span>
                {t(
                  'Назначение и особенности указаны авторами',
                  'Purpose and features are provided by authors',
                )}
              </span>
            </div>
          )}
          {filtered.length ? (
            <div className="model-grid">
              {filtered.map((model) => (
                <ModelCard key={model.id} model={model} from={returnTo} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">
                <Icon
                  name={
                    hasFilters
                      ? 'search'
                      : mode === 'favorites'
                      ? 'heart'
                      : category?.icon || 'cube'
                  }
                  width="40"
                  height="40"
                />
              </span>
              <h2>
                {hasFilters
                  ? t('Ничего не найдено', 'No models found')
                  : mode === 'favorites'
                  ? t(
                      'Здесь будут сохранённые модели',
                      'Your saved models will appear here',
                    )
                  : mode === 'mine'
                  ? t(
                      'Вы ещё не добавили модели',
                      'You have not shared any models yet',
                    )
                  : category
                  ? t(
                      'В этой категории пока нет моделей',
                      'No models in this category yet',
                    )
                  : t(
                      'В каталоге пока нет моделей',
                      'The catalog is waiting for its first model',
                    )}
              </h2>
              <p>
                {hasFilters
                  ? t(
                      'Попробуйте другой запрос или уберите часть фильтров.',
                      'Try another search or remove some filters.',
                    )
                  : mode === 'favorites'
                  ? t(
                      'Нажмите на сердечко у понравившейся модели. Она сохранится в этом браузере.',
                      'Tap a heart on a model to save it in this browser.',
                    )
                  : t(
                      'Добавьте первую работу: модель для печати, цифровой сцены или проектирования.',
                      'Share the first model for 3D printing, a digital scene or engineering.',
                    )}
              </p>
              {hasFilters ? (
                <button className="button" onClick={reset}>
                  {t('Сбросить фильтры', 'Reset filters')}
                </button>
              ) : mode === 'favorites' ? (
                <Link href="/models" className="button">
                  {t('Перейти в каталог', 'Explore catalog')}
                  <Icon name="arrow" />
                </Link>
              ) : (
                <AddModelButton />
              )}
              {!hasFilters && mode !== 'favorites' && (
                <Link href="/categories" className="text-link">
                  {t('Посмотреть категории', 'Browse categories')}
                  <Icon name="arrow" width="16" height="16" />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
