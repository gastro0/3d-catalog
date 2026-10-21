import { SiteLayout } from '../components/layout/SiteLayout';
import { CatalogView } from '../features/catalog/CatalogView';
import { usePreferences } from '../providers/PreferencesProvider';

export default function ModelsPage() {
  const { t } = usePreferences();
  return (
    <SiteLayout title={t('Каталог — ModelHub', 'Catalog — ModelHub')}>
      <div className="container page-section">
        <div className="page-heading">
          <p className="eyebrow">
            {t('КОЛЛЕКЦИЯ ВОЗМОЖНОСТЕЙ', 'A COLLECTION OF POSSIBILITIES')}
          </p>
          <h1>{t('Найдите свою форму.', 'Find your form.')}</h1>
          <p>
            {t(
              '3D-модели для печати, игр, визуализации и проектирования. Найдите нужную по названию, тегам или назначению.',
              '3D models for printing, games, visualization and engineering. Search by name, tags or purpose.',
            )}
          </p>
        </div>
        <CatalogView />
      </div>
    </SiteLayout>
  );
}
