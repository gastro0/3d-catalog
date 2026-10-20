import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useFavorites } from '../../providers/FavoritesProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { SortOption } from '../../types/model';
import { Icon } from '../../components/ui/Icon';
import { categories, Category, formats } from './categories';
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
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [format, setFormat] = useState('');
  const [sort, setSort] = useState<SortOption>('date');
  useEffect(() => {
    setSearch(typeof router.query.q === 'string' ? router.query.q : '');
  }, [router.query.q]);
  const filtered = models
    .filter(
      (model) =>
        model.name
          .toLocaleLowerCase(lang)
          .includes(search.trim().toLocaleLowerCase(lang)) &&
        (!(category?.ru || selectedCategory) ||
          model.category === (category?.ru || selectedCategory)) &&
        (!format || model.format === format) &&
        (mode !== 'favorites' || ids.includes(model.id)) &&
        (mode !== 'mine' || model.owner_id === user?.id),
    )
    .sort((first, second) => {
      if (sort === 'name') return first.name.localeCompare(second.name, lang);
      if (sort === 'size')
        return (first.file_size || 0) - (second.file_size || 0);
      return (
        (Date.parse(second.created_at) || 0) -
        (Date.parse(first.created_at) || 0)
      );
    });

  return (
    <section aria-label={t('Каталог моделей', 'Model catalog')}>
      <div className="catalog-filters">
        <label className="search-field">
          <Icon name="search" />
          <input
            type="search"
            aria-label={t('Поиск моделей', 'Search models')}
            placeholder={t(
              'Найти что-то особенное…',
              'Find something special…',
            )}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        {!category && (
          <select
            aria-label={t('Категория', 'Category')}
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">{t('Все категории', 'All categories')}</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.ru}>
                {item[lang]}
              </option>
            ))}
          </select>
        )}
        <select
          aria-label={t('Формат', 'Format')}
          value={format}
          onChange={(event) => setFormat(event.target.value)}
        >
          <option value="">{t('Все форматы', 'All formats')}</option>
          {formats.map((format) => (
            <option key={format}>{format}</option>
          ))}
        </select>
        <select
          aria-label={t('Сортировка', 'Sort order')}
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
        >
          <option value="date">{t('Сначала новые', 'Newest first')}</option>
          <option value="name">{t('По названию', 'By name')}</option>
          <option value="size">
            {t('Сначала небольшие', 'Smallest first')}
          </option>
        </select>
      </div>
      {error ? (
        <div className="empty-state" role="alert">
          <Icon name="cube" width="44" height="44" />
          <h2>
            {t('Каталог пока недоступен', 'Catalog is currently unavailable')}
          </h2>
          <p>{error}</p>
          <button className="button button-secondary" onClick={reload}>
            {t('Попробовать снова', 'Try again')}
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
          <div className="results-meta">
            <span>
              {t('Моделей найдено', 'Models found')}: {filtered.length}
            </span>
            <span>{t('От идеи — к форме', 'From idea to form')}</span>
          </div>
          {filtered.length ? (
            <div className="model-grid">
              {filtered.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon
                name={mode === 'favorites' ? 'heart' : 'cube'}
                width="44"
                height="44"
              />
              <h2>{t('Здесь пока пусто', 'Nothing here yet')}</h2>
              <p>
                {mode === 'favorites'
                  ? t(
                      'Нажмите на сердечко у понравившейся модели, чтобы сохранить её здесь.',
                      'Tap a heart on a model to save it here.',
                    )
                  : t(
                      'Попробуйте изменить фильтры или загрузите первую модель.',
                      'Try changing the filters or upload the first model.',
                    )}
              </p>
              {(search || format || selectedCategory) && (
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setSearch('');
                    setFormat('');
                    setSelectedCategory('');
                  }}
                >
                  {t('Сбросить фильтры', 'Reset filters')}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
