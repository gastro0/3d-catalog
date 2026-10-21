import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { useAuth } from '../../providers/AuthProvider';
import { usePreferences } from '../../providers/PreferencesProvider';
import { UploadModal } from './UploadModal';

export function AddModelButton({ compact = false }: { compact?: boolean }) {
  const { user, loading, openAuth } = useAuth();
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={`button${compact ? ' button-small upload-button' : ''}`}
        disabled={loading}
        onClick={() => (user ? setOpen(true) : openAuth())}
        aria-label={t('Добавить модель', 'Add model')}
      >
        <Icon name="plus" />
        <span>{t('Добавить модель', 'Add model')}</span>
      </button>
      <UploadModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
