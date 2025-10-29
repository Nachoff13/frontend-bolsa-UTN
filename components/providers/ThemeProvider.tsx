"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  // Cargar preferencia guardada o detectar preferencia del sistema
  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;
    
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
    
    setMounted(true);
  }, []);

  // Guardar preferencia cuando cambia
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme-mode", mode);
      // Actualizar clase en el html para Tailwind
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [mode, mounted]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Evitar flash de contenido sin estilo
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}

