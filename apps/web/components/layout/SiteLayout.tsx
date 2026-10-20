import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { usePreferences } from '../../providers/PreferencesProvider';
import { Header } from './Header';
import { Icon } from '../ui/Icon';

export function SiteLayout({
  children,
  title = 'ModelHub — библиотека 3D-моделей',
}: {
  children: ReactNode;
  title?: string;
}) {
  const { t } = usePreferences();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="ModelHub — каталог 3D-моделей для ваших идей. Архитектура, декор, игрушки, игровые объекты и многое другое."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <a href="#main" className="skip-link">
        {t('К содержимому', 'Skip to content')}
      </a>
      <Header />
      <main id="main" className="main-content">
        {children}
      </main>
      <footer className="site-footer container">
        <Link href="/" className="footer-brand">
          <Icon name="cube" /> ModelHub.
        </Link>
        <span>
          {t(
            'Пространство для объёмных идей.',
            'A space for ideas with dimension.',
          )}
        </span>
        <Link href="/models">
          {t('Перейти в каталог', 'Explore catalog')} ↗
        </Link>
      </footer>
    </>
  );
}
