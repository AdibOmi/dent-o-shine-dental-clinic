import { createContext, useContext, useEffect, useState } from 'react';
import { translations, toBnDigits } from './data/content';

const LangContext = createContext(null);

function readSavedLang() {
  try {
    return localStorage.getItem('dos-lang') === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(readSavedLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try {
      localStorage.setItem('dos-lang', lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const value = {
    lang,
    t: translations[lang],
    toggle: () => setLang((l) => (l === 'en' ? 'bn' : 'en')),
    num: (n) => (lang === 'bn' ? toBnDigits(n) : String(n)),
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
