// File: context/ThemeContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface ThemeContextType {
  themeColor: string;
  setThemeColor: (color: string) => void;
  bgMain: string;
  bgCard: string;
}

const ThemeContext = createContext<ThemeContextType>({
  themeColor: '#24FF00', 
  setThemeColor: () => {},
  bgMain: '#222222',
  bgCard: '#111111',
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeColor, setThemeColor] = useState('#24FF00');
  
  return (
    <ThemeContext.Provider value={{ 
      themeColor, 
      setThemeColor,
      bgMain: '#222222',
      bgCard: '#111111'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};