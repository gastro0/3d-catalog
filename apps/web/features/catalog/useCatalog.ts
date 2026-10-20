import { useCallback, useEffect, useState } from 'react';
import { api, errorMessage } from '../../lib/api';
import { Model } from '../../types/model';

export function useCatalog() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    api<Model[]>('/models', { signal: controller.signal })
      .then((models) => {
        if (!controller.signal.aborted) setModels(models);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(errorMessage(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);
  useEffect(() => {
    window.addEventListener('catalog:updated', reload);
    return () => window.removeEventListener('catalog:updated', reload);
  }, [reload]);
  return { models, loading, error, reload };
}
