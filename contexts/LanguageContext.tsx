import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS } from '../constants';
import { TranslationSet } from '../types';

type Language = 'english' | 'hindi' | 'telugu';

interface LanguageContextType {
    language: Language;
    changeLanguage: (lang: Language) => void;
    t: (key: keyof TranslationSet) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        return (localStorage.getItem('appLanguage') as Language) || 'english';
    });

    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    const t = (key: keyof TranslationSet): string => {
        return TRANSLATIONS[language][key] || key;
    };

    const changeLanguage = (newLang: Language) => {
        setLanguage(newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
