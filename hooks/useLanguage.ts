
import { useState, useEffect } from 'react';
import { TRANSLATIONS } from '../constants';
import { TranslationSet } from '../types';

export const useLanguage = () => {
  const [language, setLanguage] = useState<'english' | 'hindi' | 'telugu'>(() => {
    return (localStorage.getItem('appLanguage') as any) || 'english';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = (key: keyof TranslationSet): string => {
    return TRANSLATIONS[language][key] || key;
  };

  const changeLanguage = (newLang: 'english' | 'hindi' | 'telugu') => {
    setLanguage(newLang);
  };

  return { language, changeLanguage, t };
};
