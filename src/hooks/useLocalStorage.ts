import { useEffect, useRef, useState } from 'react';
import { LocalStorageService } from '../utils/LocalStorageService';

type SetStateAction<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(key: string, initialValue?: T) {
    const [state, setState] = useState<T | undefined>(() => LocalStorageService.get<T>(key, initialValue));
    const prevKeyRef = useRef(key);

    useEffect(() => {
        if (prevKeyRef.current !== key) {
            setState(LocalStorageService.get<T>(key, initialValue));
            prevKeyRef.current = key;
        }
    }, [key, initialValue]);

    useEffect(() => {
        if (!LocalStorageService.isBrowser()) return;
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
    }, [key]);

    const setValue = (value: SetStateAction<T | undefined>) => {
        const valueToStore = value instanceof Function ? value(state as T) : value;
        setState(valueToStore);
        LocalStorageService.set<T>(key, valueToStore);
    };

    const remove = () => {
        setState(undefined);
        LocalStorageService.remove(key);
    };

    return [state, setValue, remove] as const;
}

export default useLocalStorage;
