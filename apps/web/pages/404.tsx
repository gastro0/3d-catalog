import Link from 'next/link';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Icon } from '../components/ui/Icon';
import { usePreferences } from '../providers/PreferencesProvider';

export default function NotFoundPage() {
  const { t } = usePreferences();
  return (
    <SiteLayout title="404 — ModelHub">
      <div className="container empty-state not-found">
        <span className="eyebrow">404 / {t('НЕ НАШЛОСЬ', 'NOT FOUND')}</span>
        <Icon name="cube" width="80" height="80" />
        <h1>
          {t('Эта форма ещё не создана.', 'This shape does not exist yet.')}
        </h1>
        <p>
          {t(
            'Страница не найдена. В каталоге наверняка есть что-то интересное.',
            'Page not found. There is plenty to explore in the catalog.',
          )}
        </p>
        <Link href="/models" className="button">
          {t('Открыть каталог', 'Explore catalog')}
          <Icon name="arrow" />
        </Link>
      </div>
    </SiteLayout>
  );
}
