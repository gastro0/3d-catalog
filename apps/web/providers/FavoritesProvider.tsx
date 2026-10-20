import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface Favorites {
  ids: string[];
  toggle: (id: string) => void;
}
const Context = createContext<Favorites | null>(null);
const key = 'modelhub:favorites';
function readIds(value: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]');
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      setIds(readIds(localStorage.getItem(key)));
    } catch {}
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === key) setIds(readIds(event.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(key, JSON.stringify(ids));
      } catch {}
    }
  }, [ids, ready]);
  return (
    <Context.Provider
      value={{
        ids,
        toggle: (id) =>
          setIds((current) =>
            current.includes(id)
              ? current.filter((value) => value !== id)
              : [...current, id],
          ),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useFavorites() {
  const context = useContext(Context);
  if (!context) throw new Error('FavoritesProvider is missing');
  return context;
}
