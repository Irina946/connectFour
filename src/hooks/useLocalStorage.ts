import { useEffect, useRef, useState } from 'react';

type SetStateAction<T> = T | ((prev: T) => T);

/**
 * Generic hook to use localStorage safely with SSR guard and cross-tab sync.
 * Returns [value, setValue, removeValue].
 */
export function useLocalStorage<T>(key: string, initialValue?: T) {
    const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

    const readValue = (): T | undefined => {
        if (!isBrowser) return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`useLocalStorage read error for key "${key}":`, error);
            return initialValue;
        }
    };

    const [state, setState] = useState<T | undefined>(readValue);
    const prevKeyRef = useRef(key);

    useEffect(() => {
        if (prevKeyRef.current !== key) {
            setState(readValue());
            prevKeyRef.current = key;
        }
    }, [key]);

    useEffect(() => {
        if (!isBrowser) return;
        const handler = (e: StorageEvent) => {
            if (e.storageArea === window.localStorage && e.key === key) {
                try {
                    setState(e.newValue ? (JSON.parse(e.newValue) as T) : undefined);
                } catch (err) {
                    setState(undefined);
                }
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [key, isBrowser]);

    const setValue = (value: SetStateAction<T | undefined>) => {
        try {
            const valueToStore = value instanceof Function ? value(state as T) : value;
            setState(valueToStore);
            if (!isBrowser) return;
            if (valueToStore === undefined) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`useLocalStorage set error for key "${key}":`, error);
        }
    };

    const remove = () => {
        try {
            setState(undefined);
            if (!isBrowser) return;
            window.localStorage.removeItem(key);
        } catch (error) {
            console.warn(`useLocalStorage remove error for key "${key}":`, error);
        }
    };

    return [state, setValue, remove] as const;
}

export default useLocalStorage;
