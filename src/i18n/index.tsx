import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import zh from './zh';
import en from './en';

type Lang = 'zh' | 'en';
type TranslationKeys = typeof zh;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const translations: Record<Lang, TranslationKeys> = { zh, en };

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as Lang) || 'zh';
    }
    return 'zh';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t: I18nContextType['t'] = (key: string, params?: Record<string, string | number>) => {
    const value = getNestedValue(translations[lang] as Record<string, unknown>, key);
    if (typeof value !== 'string') {
      console.warn(`[i18n] Missing translation key: ${key} for lang: ${lang}`);
      return key.split('.').pop() || key;
    }
    if (params) {
      return Object.entries(params).reduce((str, [k, v]) => {
        return str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }, value);
    }
    return value;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return ctx;
}
