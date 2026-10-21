import { SiteLayout } from '../components/layout/SiteLayout';
import { CatalogView } from '../features/catalog/CatalogView';
import { usePreferences } from '../providers/PreferencesProvider';

export default function FavoritesPage() {
  const { t } = usePreferences();
  return (
    <SiteLayout title={t('Избранное — ModelHub', 'Saved — ModelHub')}>
      <div className="container page-section">
        <div className="page-heading">
          <p className="eyebrow">{t('ВАША ПОДБОРКА', 'YOUR COLLECTION')}</p>
          <h1>{t('Избранное', 'Saved models')}</h1>
          <p>
            {t(
              'Любимые модели всегда под рукой. Список хранится в этом браузере.',
              'Your favorite models, always at hand. Saved in this browser.',
            )}
          </p>
        </div>
        <CatalogView mode="favorites" />
      </div>
    </SiteLayout>
  );
}
