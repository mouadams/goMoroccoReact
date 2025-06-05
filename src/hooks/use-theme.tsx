import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  // Safe localStorage access
  const getStoredTheme = (): Theme | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('theme');
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
          return stored as Theme;
        }
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
    return null;
  };

  const setStoredTheme = (theme: Theme): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('theme', theme);
      }
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const applyTheme = (newTheme: Theme) => {
    try {
      if (typeof window === 'undefined') return;
      
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }
    } catch (error) {
      console.error('Failed to apply theme:', error);
    }
  };

  useEffect(() => {
    try {
      // Check if there's a theme preference in localStorage
      const savedTheme = getStoredTheme();
      if (savedTheme) {
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to system preference
        applyTheme('system');
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      setIsInitialized(true);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      setStoredTheme(newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  // Listen for system preference changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        if (theme === 'system') {
          applyTheme('system');
        }
      };
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.warn('Failed to set up system theme listener:', error);
    }
  }, [theme, isInitialized]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider. Make sure to wrap your app with <ThemeProvider>.');
  }
  return context;
};

// Optional: Create a hook that doesn't throw errors for cases where ThemeProvider might not be available
export const useThemeSafe = () => {
  const context = useContext(ThemeContext);
  return context || { theme: 'system' as Theme, setTheme: () => {} };
};