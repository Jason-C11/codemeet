"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { themes, type ThemeName } from "@/themes/theme";

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("slate-orange");

  useEffect(() => {
    const savedTheme = localStorage.getItem("codemeet-theme");

    if (savedTheme && savedTheme in themes) {
      setThemeName(savedTheme as ThemeName);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("codemeet-theme", themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider",
    );
  }

  return context;
}
