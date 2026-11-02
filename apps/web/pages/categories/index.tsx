import Link from 'next/link';
import { useState } from 'react';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { Icon } from '../../components/ui/Icon';
import { categories } from '../../features/catalog/categories';
import {
  categoryCounts,
  normalizeSearch,
} from '../../features/catalog/catalog.logic';
import { useCatalog } from '../../features/catalog/useCatalog';
import { usePreferences } from '../../providers/PreferencesProvider';

export default function CategoriesPage() {
  const { lang, t } = usePreferences();
  const { models, loading, error, reload } = useCatalog();
  const [search, setSearch] = useState('');
  const counts = categoryCounts(models);
  const hasPopulated = Object.values(counts).some((count) => count > 0);
  const visible = categories.filter((category) =>
    normalizeSearch(
      [category.ru, category.en, category.detail, category.detailEn].join(' '),
    ).includes(normalizeSearch(search)),
  );

  return (
    <SiteLayout title={t('Категории — ModelHub', 'Categories — ModelHub')}>
      <div className="container page-section">
        <div className="page-heading">
          <h1>{t('Категории', 'Categories')}</h1>
          <p>
            {t(
              'Для печати, цифровых сцен и проектирования. Выберите направление.',
              'For printing, digital scenes and engineering. Find your direction.',
            )}
          </p>
        </div>
        <div className="category-toolbar">
          <label className="search-field">
            <Icon name="search" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={t('Поиск категории', 'Search categories')}
              placeholder={t(
                'Например, кухня или миниатюры',
                'Try kitchen or miniatures',
              )}
            />
          </label>
          <span className="muted">
            {visible.length} / {categories.length}
          </span>
        </div>
        {error && (
          <div className="notice" role="alert">
            {t(
              'Не удалось загрузить количество моделей.',
              'Unable to load model counts.',
            )}{' '}
            <button className="text-button" onClick={reload}>
              {t('Повторить', 'Retry')}
            </button>
          </div>
        )}
        {!loading && !error && !hasPopulated && (
          <p className="category-note">
            {t(
              'Каталог только начинает расти. Пока показываем все направления — вы можете добавить первую модель.',
              'The collection is just getting started. Explore every category and share the first model.',
            )}
          </p>
        )}
        <div className="category-grid">
          {visible.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              className="category-card"
              key={category.slug}
            >
              <div className="category-art">
                <Icon name={category.icon} width="36" height="36" />
              </div>
              <div className="category-info">
                <h2>{category[lang]}</h2>
                <p>{lang === 'ru' ? category.detail : category.detailEn}</p>
                <span className="category-count">
                  {loading || error
                    ? '—'
                    : `${counts[category.slug]} ${t('моделей', 'models')}`}
                </span>
              </div>
              <Icon
                name="arrow"
                className="category-arrow"
                width="18"
                height="18"
              />
            </Link>
          ))}
        </div>
        {!visible.length && (
          <div className="empty-state">
            <Icon name="search" width="40" height="40" />
            <h2>{t('Категория не найдена', 'No category found')}</h2>
            <p>
              {t(
                'Попробуйте другое слово или сбросьте поиск.',
                'Try another word or clear the search.',
              )}
            </p>
            <button
              className="button button-secondary"
              onClick={() => setSearch('')}
            >
              {t('Показать все категории', 'Show all categories')}
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
