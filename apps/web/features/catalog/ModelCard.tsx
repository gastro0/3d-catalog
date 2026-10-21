import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { formatSize } from '../../lib/api';
import { useFavorites } from '../../providers/FavoritesProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { Model } from '../../types/model';
import { Icon } from '../../components/ui/Icon';
import { categoryLabel, metadataLabel, purposes } from './categories';

export function ModelCard({ model, from }: { model: Model; from?: string }) {
  const { ids, toggle } = useFavorites();
  const { lang, t } = usePreferences();
  const router = useRouter();
  const href = {
    pathname: '/models/[id]',
    query: { id: model.id, from: from || router.asPath },
  };
  const [imageFailed, setImageFailed] = useState(false);
  const saved = ids.includes(model.id);
  return (
    <article className="model-card">
      <Link href={href} className="model-preview" aria-label={model.name}>
        {model.imageUrl && !imageFailed ? (
          <img
            src={model.imageUrl}
            alt={model.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="model-placeholder">
            <Icon name="cube" width="76" height="76" />
            <span>{t('Без превью', 'No preview')}</span>
          </span>
        )}
        <span className="format-badge">{model.format}</span>
      </Link>
      <button
        className={`save-button ${saved ? 'saved' : ''}`}
        onClick={() => toggle(model.id)}
        aria-pressed={saved}
        aria-label={
          saved
            ? t('Убрать из избранного', 'Remove from saved')
            : t('В избранное', 'Save model')
        }
      >
        <Icon name="heart" />
      </button>
      <div className="model-card-body">
        <p className="model-category">{categoryLabel(model.category, lang)}</p>
        <h3>
          <Link href={href}>{model.name}</Link>
        </h3>
        {!!model.purposes?.length && (
          <div className="model-purposes">
            {model.purposes.map((purpose) => (
              <span className="metadata-badge" key={purpose}>
                {metadataLabel(purposes, purpose, lang)}
              </span>
            ))}
          </div>
        )}
        <div className="model-meta">
          <span>{model.format}</span>
          <span>{formatSize(model.file_size)}</span>
        </div>
      </div>
    </article>
  );
}
