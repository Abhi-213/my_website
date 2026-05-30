import { useEffect, useState, useCallback, createContext, useContext } from 'react';

export type Theme = 'amber' | 'violet';

const STORAGE_KEY = 'abhijay-portfolio-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'amber';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'amber' || stored === 'violet') return stored;
  return 'amber';
}

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'amber',
  setTheme: () => {},
  toggle: () => {},
});

export function useThemeProvider(): ThemeContextValue {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(() => {
    setThemeState((t) => (t === 'amber' ? 'violet' : 'amber'));
  }, []);

  return { theme, setTheme, toggle };
}

export function useTheme() {
  return useContext(ThemeContext);
}
