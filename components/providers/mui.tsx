"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider, createTheme, PaletteMode } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme as useThemeContext } from "./ThemeProvider";

import "@mui/material/styles";

// ===========================================================
// 🔧 Extensión del tipo Palette de MUI
// ===========================================================
declare module "@mui/material/styles" {
  interface Palette {
    customStatus: {
      iniciada: string;
      enRevision: string;
      aprobada: string;
      rechazada: string;
      modalidad: string;
      contrato: string;
    };
    carreras: Record<string, string>; // 🎓 NUEVA SECCIÓN PARA COLORES DE CARRERAS
  }

  interface PaletteOptions {
    customStatus?: {
      iniciada?: string;
      enRevision?: string;
      aprobada?: string;
      rechazada?: string;
      modalidad?: string;
      contrato?: string;
    };
    carreras?: Record<string, string>;
  }
}

// ===========================================================
// 🎨 Función para crear el tema con modo claro/oscuro
// ===========================================================
const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#00658f", contrastText: "#ffffff" },
      secondary: { main: "#c2185b" },
      info: { main: "#00bcd4" },
      warning: { main: "#ffa726" },
      error: { main: "#ef5350" },
      success: { main: "#4caf50" },

      // ✅ COLORES PERSONALIZADOS PARA ESTADOS
      customStatus: {
        iniciada: "#0ea5e9", // Celeste UTN (azul)
        enRevision: "#0284c7", // Azul medio
        aprobada: "#4caf50", // Verde éxito
        rechazada: "#ef5350", // Rojo error
        modalidad: "#00658f", // Azul UTN base
        contrato: "#004c6d", // Azul profundo
      },

      // 🎓 COLORES OFICIALES POR CARRERA (usables globalmente)
      carreras: {
        "Ingeniería Civil": "#0e8341",
        "Ingeniería Mecánica": "#267e7c",
        "Ingeniería Química": "#926d29",
        "Ciencias Básicas": "#8b181b",
        "Ingeniería Industrial": "#c05029",
        "Ingeniería en Sistemas de Información": "#4579b0",
        "Ingeniería Eléctrica": "#cb4047",
      },

      ...(mode === "light"
        ? {
            background: { default: "#f9fafa", paper: "#f0f8f9" },
            text: { primary: "#222", secondary: "#555" },
          }
        : {
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#ffffff", secondary: "#b0b0b0" },
          }),
    },

    // ===========================================================
    // 🧾 Tipografía general
    // ===========================================================
    typography: {
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
      fontSize: 16,
      h3: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.3 },
      h4: { fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.3 },
      h5: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 },
      h6: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.4 },
      subtitle1: { fontSize: "1.125rem", lineHeight: 1.5 },
      subtitle2: { fontSize: "1rem", lineHeight: 1.5 },
      body1: { fontSize: "1rem", lineHeight: 1.6 },
      body2: { fontSize: "0.9375rem", lineHeight: 1.6, color: "#555" },
      button: { fontSize: "1rem", fontWeight: 500, textTransform: "none" },
      caption: { fontSize: "0.875rem", lineHeight: 1.5 },
    },

    // ===========================================================
    // 🎨 Overrides de componentes MUI
    // ===========================================================
    components: {
      MuiButton: {
        styleOverrides: {
          root: { padding: "10px 24px", fontSize: "1rem" },
          contained: { borderRadius: 8, fontWeight: 500, minWidth: 120 },
          outlined: { borderRadius: 8, fontWeight: 500, minWidth: 120 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === "light"
                ? "0 2px 6px rgba(0,0,0,0.05)"
                : "0 2px 6px rgba(0,0,0,0.3)",
            backgroundImage: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12, padding: 16, backgroundImage: "none" },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            fontSize: "0.875rem",
            borderRadius: 8,
            padding: "0 12px",
            height: 32,
          },
          sizeSmall: { fontSize: "0.8125rem", height: 28, padding: "0 10px" },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": { fontSize: "1rem" },
            "& .MuiInputLabel-root": { fontSize: "1rem" },
            "& .MuiFormHelperText-root": { fontSize: "0.875rem" },
          },
        },
        defaultProps: { variant: "outlined" },
      },
      MuiInputLabel: { styleOverrides: { root: { fontSize: "1rem" } } },
      MuiSelect: { styleOverrides: { select: { fontSize: "1rem" } } },
      MuiMenuItem: {
        styleOverrides: {
          root: { fontSize: "1rem", padding: "12px 16px" },
        },
      },
      MuiCheckbox: { styleOverrides: { root: { padding: "10px" } } },
      MuiFormControlLabel: {
        styleOverrides: { label: { fontSize: "1rem" } },
      },
    },
  });

// ===========================================================
// 🌈 Provider del theme MUI
// ===========================================================
export function MuiThemeProvider({ children }: { children: ReactNode }) {
  const { mode } = useThemeContext();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
