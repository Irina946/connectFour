import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ILanguageContextType {
    language: string;
    changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<ILanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && i18n.language !== savedLanguage) {
            i18n.changeLanguage(savedLanguage).catch((error) => {
                console.error('Failed to change language:', error);
            });
        }
    }, [i18n]);

    const changeLanguage = (lng: string) => {
        localStorage.setItem('language', lng);
        i18n.changeLanguage(lng).catch((error) => {
            console.error('Failed to change language:', error);
        });
    };

    const value: ILanguageContextType = {
        language: i18n.language,
        changeLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};


export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
