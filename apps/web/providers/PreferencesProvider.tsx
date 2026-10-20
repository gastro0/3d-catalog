import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Language = 'ru' | 'en';
type Theme = 'light' | 'dark';
interface Preferences {
  lang: Language;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
  t: (ru: string, en: string) => string;
}
const Context = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ru');
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('lang');
      const savedTheme = localStorage.getItem('theme');
      if (savedLang === 'ru' || savedLang === 'en') setLang(savedLang);
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('theme', theme);
      localStorage.setItem('lang', lang);
    } catch {}
  }, [theme, lang, ready]);

  return (
    <Context.Provider
      value={{
        lang,
        theme,
        toggleLang: () => setLang((value) => (value === 'ru' ? 'en' : 'ru')),
        toggleTheme: () =>
          setTheme((value) => (value === 'light' ? 'dark' : 'light')),
        t: (ru, en) => (lang === 'ru' ? ru : en),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function usePreferences() {
  const context = useContext(Context);
  if (!context) throw new Error('PreferencesProvider is missing');
  return context;
}
