import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', 'light');
  const [chipSizeKey] = useLocalStorage<string>('chipSize', 'medium');
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const currentTheme = (theme ?? 'light') as Theme;

  useEffect(() => {
    document.body.className = currentTheme === 'dark' ? 'appDarkTheme' : 'appLightTheme';
  }, [currentTheme]);

  useEffect(() => {
    const root = document.documentElement;
    const sizes: Record<string, string> = {
      extraSmall: '24px',
      small: '48px',
      medium: '64px',
      large: '80px',
      extraLarge: '96px',
    };
    const multipliers: Record<string, number> = {
      xs: 24 / 64,
      s: 48 / 64,
      m: 1,
      l: 80 / 64,
      xl: 96 / 64,
    };

    const selectedKey = chipSizeKey ?? 'medium';
    const selectedPx = parseFloat(sizes[selectedKey] || '64');

    root.style.setProperty('--chip-size-xs', `${Math.round(selectedPx * multipliers.xs)}px`);
    root.style.setProperty('--chip-size-s', `${Math.round(selectedPx * multipliers.s)}px`);
    root.style.setProperty('--chip-size-m', `${Math.round(selectedPx * multipliers.m)}px`);
    root.style.setProperty('--chip-size-l', `${Math.round(selectedPx * multipliers.l)}px`);
    root.style.setProperty('--chip-size-xl', `${Math.round(selectedPx * multipliers.xl)}px`);
  }, [chipSizeKey]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
