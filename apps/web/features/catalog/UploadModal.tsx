import { FormEvent, useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../../lib/api';
import { getSupabase } from '../../lib/supabase';
import { usePreferences } from '../../providers/PreferencesProvider';
import { Model } from '../../types/model';
import { Modal } from '../../components/ui/Modal';
import { Icon } from '../../components/ui/Icon';
import { categories, formats } from './categories';

export function UploadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang, t } = usePreferences();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) {
      setFile(null);
      setName('');
      setDescription('');
      setCategory('');
      setError('');
      setDragging(false);
    }
  }, [open]);

  function selectFile(selected?: File) {
    if (!selected) return;
    const extension = selected.name.split('.').pop()?.toUpperCase() || '';
    if (!formats.includes(extension)) {
      setError(
        t(
          'Выберите файл поддерживаемого формата.',
          'Choose a supported file format.',
        ),
      );
      return;
    }
    if (!selected.size || selected.size > 26214400) {
      setError(
        t(
          'Размер файла: от 1 байта до 25 МБ.',
          'File size must be between 1 byte and 25 MB.',
        ),
      );
      return;
    }
    setError('');
    setFile(selected);
    if (!name) setName(selected.name.replace(/\.[^.]+$/, '').slice(0, 120));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError(t('Выберите файл модели.', 'Select a model file.'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { data, error } = await getSupabase().auth.getSession();
      if (error) throw error;
      if (!data.session)
        throw new Error(
          t('Войдите в аккаунт перед загрузкой.', 'Sign in before uploading.'),
        );
      const body = new FormData();
      body.append('file', file);
      body.append('name', name.trim());
      body.append('description', description.trim());
      body.append('category', category);
      await api<Model>('/models', {
        method: 'POST',
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        body,
      });
      window.dispatchEvent(new Event('catalog:updated'));
      onClose();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      title={t('Поделитесь своей моделью', 'Share your model')}
    >
      <p className="muted">
        {t(
          'Добавьте работу в общую коллекцию. Она станет доступна всем.',
          'Add your work to the collection. It will be available to everyone.',
        )}
      </p>
      <form className="form-stack" onSubmit={submit}>
        <div
          className={`dropzone ${dragging ? 'dragging' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (!busy) selectFile(event.dataTransfer.files[0]);
          }}
        >
          <Icon name="cube" width="32" height="32" />
          <strong>
            {file
              ? file.name
              : t('Перетащите файл модели сюда', 'Drop your model file here')}
          </strong>
          <span className="muted">
            OBJ, FBX, GLTF, GLB, STL, ZIP · {t('до 25 МБ', 'up to 25 MB')}
          </span>
          <button
            type="button"
            className="text-button"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {file
              ? t('Выбрать другой файл', 'Choose another file')
              : t('Выбрать файл', 'Browse files')}
          </button>
          <input
            ref={input}
            type="file"
            accept=".obj,.fbx,.gltf,.glb,.stl,.zip"
            hidden
            disabled={busy}
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
        </div>
        <label>
          {t('Название', 'Name')}
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={120}
            disabled={busy}
          />
        </label>
        <label>
          {t('Категория', 'Category')}
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            disabled={busy}
          >
            <option value="">
              {t('Выберите категорию', 'Select category')}
            </option>
            {categories.map((item) => (
              <option key={item.slug} value={item.ru}>
                {item[lang]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('Описание', 'Description')}
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={5000}
            disabled={busy}
          />
        </label>
        {error && (
          <p className="notice notice-error" role="alert">
            {error}
          </p>
        )}
        <button className="button" disabled={busy || !file}>
          {busy
            ? t('Загружаем…', 'Uploading…')
            : t('Опубликовать модель', 'Publish model')}
          <Icon name="arrow" />
        </button>
      </form>
    </Modal>
  );
}
