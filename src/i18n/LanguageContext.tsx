import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Language, TranslationKey, TRANSLATIONS, translateCategoryName } from './translations';

const LANGUAGE_STORAGE_KEY = 'mills_language_preference';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  translateCategory: (name: string) => string;
  isSpanish: boolean;
  toggleLanguage: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Cargar preferencia guardada al iniciar la aplicación
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const saved = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
        if (saved === 'en' || saved === 'es') {
          setLanguageState(saved);
        }
      } catch (err) {
        console.warn('Error cargando idioma guardado:', err);
      }
    };
    loadSavedLanguage();
  }, []);

  const setLanguage = useCallback(async (newLang: Language) => {
    setLanguageState(newLang);
    try {
      await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, newLang);
    } catch (err) {
      console.warn('Error guardando preferencia de idioma:', err);
    }
  }, []);

  const toggleLanguage = useCallback(async () => {
    const next = language === 'en' ? 'es' : 'en';
    await setLanguage(next);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKey): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] || TRANSLATIONS.en[key] || key;
    },
    [language]
  );

  const translateCategory = useCallback(
    (name: string): string => {
      return translateCategoryName(name, language);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateCategory,
        isSpanish: language === 'es',
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
