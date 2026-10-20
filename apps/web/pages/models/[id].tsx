import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SiteLayout } from '../../components/layout/SiteLayout';
import { Icon } from '../../components/ui/Icon';
import { categoryLabel } from '../../features/catalog/categories';
import { api, errorMessage, formatSize } from '../../lib/api';
import { getSupabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { useFavorites } from '../../providers/FavoritesProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { Model } from '../../types/model';

export default function ModelPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const { lang, t } = usePreferences();
  const { user } = useAuth();
  const { ids, toggle } = useFavorites();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setModel(null);
    setImageFailed(false);
    setActionError('');
    api<Model>(`/models/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setModel(data);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  async function download() {
    setBusy(true);
    setActionError('');
    try {
      const { url } = await api<{ url: string }>(
        `/models/${encodeURIComponent(id)}/download`,
      );
      window.location.assign(url);
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (
      !window.confirm(
        t(
          'Удалить модель и её файл? Это действие нельзя отменить.',
          'Delete the model and its file? This cannot be undone.',
        ),
      )
    )
      return;
    setBusy(true);
    setActionError('');
    try {
      const { data } = await getSupabase().auth.getSession();
      if (!data.session)
        throw new Error(t('Войдите снова.', 'Please sign in again.'));
      await api(`/models/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      if (ids.includes(id)) toggle(id);
      await router.push('/profile');
    } catch (error) {
      setActionError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SiteLayout title={model ? `${model.name} — ModelHub` : 'ModelHub'}>
      <div className="container page-section">
        <Link href="/models" className="breadcrumb">
          ← {t('В каталог', 'Back to catalog')}
        </Link>
        {loading ? (
          <p className="empty-state" role="status">
            {t('Загрузка модели…', 'Loading model…')}
          </p>
        ) : error || !model ? (
          <div className="empty-state" role="alert">
            <h1>{t('Не удалось открыть модель', 'Unable to open model')}</h1>
            <p>{error || t('Модель не найдена.', 'Model not found.')}</p>
          </div>
        ) : (
          <div className="model-detail">
            <div className="detail-preview">
              {model.imageUrl && !imageFailed ? (
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span className="model-placeholder">
                  <Icon name="cube" width="128" height="128" />
                  <span>{t('Превью пока нет', 'No preview available')}</span>
                </span>
              )}
              <span className="format-badge">{model.format}</span>
            </div>
            <div className="detail-copy">
              <p className="eyebrow">{categoryLabel(model.category, lang)}</p>
              <h1>{model.name}</h1>
              <p className="model-description">
                {model.description ||
                  t(
                    'Автор пока не добавил описание.',
                    'The author has not added a description yet.',
                  )}
              </p>
              <dl className="model-specs">
                <div>
                  <dt>{t('Формат', 'Format')}</dt>
                  <dd>{model.format}</dd>
                </div>
                <div>
                  <dt>{t('Размер', 'Size')}</dt>
                  <dd>{formatSize(model.file_size)}</dd>
                </div>
                <div>
                  <dt>{t('Полигоны', 'Polygons')}</dt>
                  <dd>
                    {model.polygons
                      ? model.polygons.toLocaleString(lang)
                      : t('Не указано', 'Not specified')}
                  </dd>
                </div>
                <div>
                  <dt>{t('Добавлено', 'Added')}</dt>
                  <dd>
                    {model.created_at
                      ? new Date(model.created_at).toLocaleDateString(lang)
                      : '—'}
                  </dd>
                </div>
              </dl>
              <div className="detail-actions">
                <button className="button" onClick={download} disabled={busy}>
                  <Icon name="download" />
                  {busy
                    ? t('Подождите…', 'Please wait…')
                    : t('Скачать модель', 'Download model')}
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => toggle(id)}
                  aria-pressed={ids.includes(id)}
                >
                  <Icon name="heart" />
                  {ids.includes(id)
                    ? t('Сохранено', 'Saved')
                    : t('Сохранить', 'Save')}
                </button>
              </div>
              {user?.id === model.owner_id && (
                <button
                  className="text-button danger-text"
                  onClick={remove}
                  disabled={busy}
                >
                  {t('Удалить модель', 'Delete model')}
                </button>
              )}
              {actionError && (
                <p className="notice notice-error" role="alert">
                  {actionError}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
