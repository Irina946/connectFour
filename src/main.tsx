import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { i18nInitPromise } from './i18n'


i18nInitPromise.then(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}).catch((error) => {
    console.error('Failed to initialize i18n:', error);
});
