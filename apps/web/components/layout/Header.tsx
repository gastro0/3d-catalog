import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { UploadModal } from '../../features/catalog/UploadModal';
import { Icon } from '../ui/Icon';

export function Header() {
  const { pathname } = useRouter();
  const { user, loading, openAuth } = useAuth();
  const { lang, theme, t, toggleLang, toggleTheme } = usePreferences();
  const [uploadOpen, setUploadOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="ModelHub — главная">
            <span className="brand-mark">
              <Icon name="cube" width="25" height="25" />
            </span>
            ModelHub<span className="brand-dot">.</span>
          </Link>
          <nav
            className="main-nav"
            aria-label={t('Основная навигация', 'Main navigation')}
          >
            <Link
              href="/models"
              className={pathname.startsWith('/models') ? 'active' : ''}
            >
              {t('Каталог', 'Catalog')}
            </Link>
            <Link
              href="/#categories"
              className={
                pathname === '/' || pathname.startsWith('/categories')
                  ? 'active'
                  : ''
              }
            >
              {t('Категории', 'Categories')}
            </Link>
            <Link
              href="/favorites"
              className={pathname === '/favorites' ? 'active' : ''}
            >
              {t('Избранное', 'Saved')}
            </Link>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button language-button"
              onClick={toggleLang}
              aria-label={t('Switch to English', 'Переключить на русский')}
            >
              {lang.toUpperCase()}
            </button>
            <button
              className="icon-button theme-button"
              onClick={toggleTheme}
              aria-label={t('Переключить тему', 'Toggle theme')}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </button>
            <button
              className="button button-small upload-button"
              onClick={() => (user ? setUploadOpen(true) : openAuth())}
            >
              <Icon name="plus" />
              <span>{t('Загрузить модель', 'Upload model')}</span>
            </button>
            {user ? (
              <Link
                href="/profile"
                className="avatar"
                aria-label={t('Профиль', 'Profile')}
              >
                {user.email?.[0]?.toUpperCase() || <Icon name="user" />}
              </Link>
            ) : (
              <button
                className="login-button"
                onClick={openAuth}
                disabled={loading}
              >
                {t('Войти', 'Sign in')}
              </button>
            )}
          </div>
        </div>
      </header>
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
