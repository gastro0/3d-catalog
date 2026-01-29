import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'ru' | 'en';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>('ru');

  useEffect(() => {
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (storedLang === 'ru' || storedLang === 'en') {
      setLangState(storedLang);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', newLang);
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};

export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}
