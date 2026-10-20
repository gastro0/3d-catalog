import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Icon } from '../components/ui/Icon';
import { categories } from '../features/catalog/categories';
import { usePreferences } from '../providers/PreferencesProvider';

export default function Home() {
  const { lang, t } = usePreferences();
  const router = useRouter();
  const [search, setSearch] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    router.push({
      pathname: '/models',
      query: search.trim() ? { q: search.trim() } : {},
    });
  }
  return (
    <SiteLayout>
      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" />
              {t('БИБЛИОТЕКА 3D-МОДЕЛЕЙ', 'THE 3D MODEL LIBRARY')}
            </span>
            <h1>
              {t('Идеи обретают', 'Give your ideas')}
              <br />
              <em>{t('объём.', 'dimension.')}</em>
            </h1>
            <p>
              {t(
                'Находите готовые модели, вдохновляйтесь и создавайте своё. Следующий проект начинается здесь.',
                'Find ready-made models, get inspired, and make something of your own. Your next project starts here.',
              )}
            </p>
            <form className="hero-search" onSubmit={submit}>
              <Icon name="search" />
              <input
                aria-label={t('Поиск по каталогу', 'Search the catalog')}
                placeholder={t(
                  'Что хотите создать?',
                  'What do you want to create?',
                )}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button
                className="button"
                aria-label={t('Найти модели', 'Find models')}
              >
                <Icon name="arrow" />
              </button>
            </form>
            <div className="hero-formats">
              <span>
                {t('От простого к сложному', 'From simple to intricate')}
              </span>
              <span className="mini-divider" />
              OBJ · FBX · GLTF · STL
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-caption">
              <span>COLLECTION / 01</span>
              <Icon name="cube" />
            </div>
            <div className="hero-image-main">
              <img src="/categories/decor.jpg" alt="" />
              <span>
                {t(
                  'Форма. Фактура. Вдохновение.',
                  'Form. Texture. Inspiration.',
                )}
              </span>
            </div>
            <div className="hero-image-small">
              <img src="/categories/architecture.jpg" alt="" />
            </div>
            <div className="hero-sticker">
              <Icon name="cube" width="30" height="30" />
              <span>
                {t('СОЗДАВАЙТЕ', 'MAKE IT')}
                <br />
                {t('В ОБЪЁМЕ', 'IN 3D')}
              </span>
            </div>
            <span className="art-index">
              ↗ {t('Ваш следующий проект', 'Your next project')}
            </span>
          </div>
        </section>
        <section id="categories" className="categories-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {t('НАЙДИТЕ СВОЁ НАПРАВЛЕНИЕ', 'FIND YOUR DIRECTION')}
              </p>
              <h2>
                {t('Мир в шести категориях', 'A world in six categories')}
              </h2>
            </div>
            <Link href="/models" className="text-link">
              {t('Весь каталог', 'All models')}
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                href={`/categories/${category.slug}`}
                className="category-card"
                key={category.slug}
              >
                <div className="category-image">
                  <img
                    src={`/categories/${category.slug}.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  <span className="category-index">0{index + 1}</span>
                  <span className="category-arrow">
                    <Icon name="arrow" />
                  </span>
                </div>
                <div className="category-info">
                  <h3>{category[lang]}</h3>
                  <p>{lang === 'ru' ? category.detail : category.detailEn}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="community-banner">
          <div className="community-icon">
            <Icon name="cube" width="56" height="56" />
          </div>
          <div>
            <p className="eyebrow">
              {t('ОТКРЫТО ДЛЯ ВАШИХ ИДЕЙ', 'OPEN TO YOUR IDEAS')}
            </p>
            <h2>
              {t(
                'Хорошие модели стоит делить.',
                'Good models are worth sharing.',
              )}
            </h2>
            <p>
              {t(
                'Собирайте вдохновение и пополняйте коллекцию своими работами.',
                'Collect inspiration and add your own work to the collection.',
              )}
            </p>
          </div>
          <Link href="/models" className="button">
            {t('Открыть каталог', 'Explore catalog')}
            <Icon name="arrow" />
          </Link>
        </section>
      </div>
    </SiteLayout>
  );
}
