import { FormEvent, useEffect, useRef, useState } from 'react';
import { api, errorMessage } from '../../lib/api';
import { getSupabase } from '../../lib/supabase';
import { usePreferences } from '../../providers/PreferencesProvider';
import { Model } from '../../types/model';
import { Modal } from '../../components/ui/Modal';
import { Icon } from '../../components/ui/Icon';
import {
  categories,
  features,
  formats,
  licenses,
  purposes,
  softwareOptions,
} from './categories';

function Choices({
  legend,
  options,
  values,
  onChange,
  disabled,
}: {
  legend: string;
  options: readonly { value: string; label: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="choice-group" disabled={disabled}>
      <legend>{legend}</legend>
      <div className="choice-options">
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...values, option.value]
                    : values.filter((value) => value !== option.value),
                )
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

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
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [software, setSoftware] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [license, setLicense] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [printNotes, setPrintNotes] = useState('');
  const [fileContents, setFileContents] = useState('');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) {
      setFile(null);
      setName('');
      setDescription('');
      setCategory('');
      setSelectedPurposes([]);
      setSelectedFeatures([]);
      setSoftware([]);
      setTags('');
      setLicense('');
      setDimensions('');
      setPrintNotes('');
      setFileContents('');
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
    const parsedTags = [
      ...new Set(
        tags
          .split(',')
          .map((tag) => tag.trim().replace(/^#/, ''))
          .filter(Boolean),
      ),
    ];
    if (parsedTags.length > 12 || parsedTags.some((tag) => tag.length > 40)) {
      setError(
        t(
          'Добавьте не более 12 тегов, до 40 символов каждый.',
          'Use up to 12 tags, at most 40 characters each.',
        ),
      );
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
      body.append('purposes', JSON.stringify(selectedPurposes));
      body.append('features', JSON.stringify(selectedFeatures));
      body.append('software', JSON.stringify(software));
      body.append('tags', JSON.stringify(parsedTags));
      body.append('license', license);
      body.append('dimensions', dimensions.trim());
      body.append('print_notes', printNotes.trim());
      body.append('file_contents', fileContents.trim());
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
        <Choices
          legend={t(
            'Назначение — можно выбрать несколько',
            'Purpose — select all that apply',
          )}
          options={purposes.map((item) => ({
            value: item.value,
            label: item[lang],
          }))}
          values={selectedPurposes}
          onChange={setSelectedPurposes}
          disabled={busy}
        />
        <p className="field-hint">
          {t(
            'Укажите, для чего подготовлена модель. Формат файла сам по себе не подтверждает готовность к печати.',
            'Choose the uses your model is prepared for. File format alone does not establish printability.',
          )}
        </p>
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
        <label>
          {t('Теги через запятую', 'Tags, separated by commas')}
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder={t(
              'подарок, космос, для начинающих',
              'gift, space, beginner',
            )}
            maxLength={500}
            disabled={busy}
          />
          <span className="field-hint">
            {t(
              'До 12 тегов. Темы могут объединять разные категории.',
              'Up to 12 tags. Themes can span multiple categories.',
            )}
          </span>
        </label>
        <label>
          {t('Лицензия', 'License')}
          <select
            value={license}
            onChange={(event) => setLicense(event.target.value)}
            disabled={busy}
          >
            <option value="">{t('Не указана', 'Not specified')}</option>
            {licenses.map((item) => (
              <option key={item.value} value={item.value}>
                {item[lang]}
              </option>
            ))}
          </select>
        </label>
        <details className="upload-details">
          <summary>
            {t('Особенности и сведения о файле', 'Features and file details')}
          </summary>
          <div className="form-stack">
            <Choices
              legend={t('Особенности модели', 'Model features')}
              options={features.map((item) => ({
                value: item.value,
                label: item[lang],
              }))}
              values={selectedFeatures}
              onChange={setSelectedFeatures}
              disabled={busy}
            />
            <Choices
              legend={t(
                'Проверенная совместимость с программами',
                'Tested software compatibility',
              )}
              options={softwareOptions.map((value) => ({
                value,
                label: value,
              }))}
              values={software}
              onChange={setSoftware}
              disabled={busy}
            />
            <label>
              {t('Размеры и единицы измерения', 'Dimensions and units')}
              <input
                value={dimensions}
                onChange={(event) => setDimensions(event.target.value)}
                maxLength={160}
                placeholder={t(
                  'Например, 120 × 80 × 40 мм',
                  'For example, 120 × 80 × 40 mm',
                )}
                disabled={busy}
              />
            </label>
            <label>
              {t('Состав файлов', 'File contents')}
              <textarea
                value={fileContents}
                onChange={(event) => setFileContents(event.target.value)}
                maxLength={2000}
                rows={2}
                placeholder={t(
                  'Что входит в модель или архив',
                  'What is included in the model or archive',
                )}
                disabled={busy}
              />
            </label>
            <label>
              {t('Рекомендации по печати', 'Printing recommendations')}
              <textarea
                value={printNotes}
                onChange={(event) => setPrintNotes(event.target.value)}
                maxLength={2000}
                rows={3}
                placeholder={t(
                  'Материал, слой, заполнение, поддержки, сборка',
                  'Material, layer height, infill, supports, assembly',
                )}
                disabled={busy}
              />
            </label>
          </div>
        </details>
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
