import Link from 'next/link';
import { useState } from 'react';
import { formatSize } from '../../lib/api';
import { useFavorites } from '../../providers/FavoritesProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { Model } from '../../types/model';
import { Icon } from '../../components/ui/Icon';
import { categoryLabel } from './categories';

export function ModelCard({ model }: { model: Model }) {
  const { ids, toggle } = useFavorites();
  const { lang, t } = usePreferences();
  const [imageFailed, setImageFailed] = useState(false);
  const saved = ids.includes(model.id);
  return (
    <article className="model-card">
      <Link
        href={`/models/${model.id}`}
        className="model-preview"
        aria-label={model.name}
      >
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
          <Link href={`/models/${model.id}`}>{model.name}</Link>
        </h3>
        <div className="model-meta">
          <span>{model.format}</span>
          <span>{formatSize(model.file_size)}</span>
        </div>
      </div>
    </article>
  );
}
