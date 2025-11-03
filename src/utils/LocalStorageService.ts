export class LocalStorageService {
    static isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    static get<T>(key: string, initialValue?: T): T | undefined {
        if (!LocalStorageService.isBrowser()) return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`LocalStorageService read error for key "${key}":`, error);
            return initialValue;
        }
    }

    static set<T>(key: string, value: T | undefined): void {
        if (!LocalStorageService.isBrowser()) return;
        try {
            if (value === undefined) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.warn(`LocalStorageService set error for key "${key}":`, error);
        }
    }

    static remove(key: string): void {
        if (!LocalStorageService.isBrowser()) return;
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.warn(`LocalStorageService remove error for key "${key}":`, error);
        }
    }
}

