import { useState } from 'react';
import { SiteLayout } from '../components/layout/SiteLayout';
import { Icon } from '../components/ui/Icon';
import { CatalogView } from '../features/catalog/CatalogView';
import { errorMessage } from '../lib/api';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProvider';
import { usePreferences } from '../providers/PreferencesProvider';

export default function ProfilePage() {
  const { user, loading, openAuth } = useAuth();
  const { t, lang } = usePreferences();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    setError('');
    try {
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <SiteLayout title={t('Профиль — ModelHub', 'Profile — ModelHub')}>
      <div className="container page-section">
        {loading ? (
          <p role="status">{t('Загрузка профиля…', 'Loading profile…')}</p>
        ) : user ? (
          <>
            <div className="profile-panel">
              <div className="profile-avatar">
                <Icon name="user" width="36" height="36" />
              </div>
              <div>
                <p className="eyebrow">
                  {t('ЛИЧНОЕ ПРОСТРАНСТВО', 'YOUR PERSONAL SPACE')}
                </p>
                <h1>{user.email}</h1>
                <p className="muted">
                  {t('В коллекции с', 'Member since')}{' '}
                  {new Date(user.created_at).toLocaleDateString(lang)}
                </p>
              </div>
              <button
                className="button button-secondary"
                onClick={signOut}
                disabled={busy}
              >
                {busy ? t('Выходим…', 'Signing out…') : t('Выйти', 'Sign out')}
              </button>
            </div>
            {error && (
              <p className="notice notice-error" role="alert">
                {error}
              </p>
            )}
            <div className="section-heading">
              <h2>{t('Мои модели', 'My models')}</h2>
            </div>
            <CatalogView mode="mine" />
          </>
        ) : (
          <div className="empty-state">
            <Icon name="user" width="48" height="48" />
            <h1>
              {t('Ваше пространство для творчества', 'Your creative space')}
            </h1>
            <p>
              {t(
                'Войдите, чтобы загружать модели и управлять своими работами.',
                'Sign in to upload models and manage your work.',
              )}
            </p>
            <button className="button" onClick={openAuth}>
              {t('Войти в аккаунт', 'Sign in')}
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
