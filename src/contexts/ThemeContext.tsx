import { createContext, FC, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useChipSizeEffect } from '../hooks/useUISettings';

export type TTheme = 'light' | 'dark';

interface IThemeContextType {
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<IThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useLocalStorage<TTheme>('theme', 'light');
  const [chipSizeKey] = useLocalStorage<string>('chipSize', 'medium');

  const currentTheme = (theme ?? 'light') as TTheme;

  useEffect(() => {
    document.body.className = currentTheme === 'dark' ? 'appDarkTheme' : 'appLightTheme';
  }, [currentTheme]);

  useChipSizeEffect(chipSizeKey);

  const value = useMemo<IThemeContextType>(() => ({
    theme: currentTheme,
    setTheme: setThemeState, 
  }), [currentTheme, setThemeState]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
