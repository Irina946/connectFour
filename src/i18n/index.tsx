import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ru',
        debug: import.meta.env.DEV,
        
        ns: ['translation', 'game', 'settings'],
        defaultNS: 'translation',
        
        interpolation: {
            escapeValue: false,
        },
        
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'language',
        },
    });

export default i18n;
