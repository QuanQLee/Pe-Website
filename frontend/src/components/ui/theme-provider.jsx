import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeCtx = createContext({ theme: 'light', toggle: () => {} });

export const ThemeProvider = ({ children }) => {
  const prefersDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useState(() =>
    localStorage.theme || (prefersDark() ? 'dark' : 'light')
  );
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.theme = theme;
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
};
export const useTheme = () => useContext(ThemeCtx);