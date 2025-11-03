"use client";

import { ReactNode, useMemo } from "react";
import { ThemeProvider, createTheme, PaletteMode } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme as useThemeContext } from "./ThemeProvider";

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customStatus: {
      iniciada: string;
      enRevision: string;
      aprobada: string;
      rechazada: string;
      modalidad: string;
      contrato: string;
    };
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
  }
}

// Función para crear el tema basado en el modo
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
      // 🎨 NUEVOS COLORES PERSONALIZADOS PARA ESTADOS
      customStatus: {
        iniciada: "#0ea5e9",    // Celeste UTN
        enRevision: "#0284c7",  // Azul medio
        aprobada: "#00796b",    // Verde-azulado éxito
        rechazada: "#607d8b",   // Gris azulado neutro
        modalidad: "#00658f",   // Azul UTN base
        contrato: "#004c6d",    // Azul profundo
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


  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 16, // Aumentar tamaño base de 14px a 16px
    h3: {
      fontSize: "2rem", // 32px
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.75rem", // 28px
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.25rem", // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "1.125rem", // 18px
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "1rem", // 16px
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem", // 16px
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.9375rem", // 15px
      lineHeight: 1.6,
      color: "#555",
    },
    button: {
      fontSize: "1rem", // 16px
      fontWeight: 500,
      textTransform: "none", // Evitar mayúsculas automáticas
    },
    caption: {
      fontSize: "0.875rem", // 14px (aumentado desde 12px)
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "10px 24px",
          fontSize: "1rem",
        },
        contained: {
          borderRadius: 8,
          fontWeight: 500,
          minWidth: 120,
        },
        outlined: {
          borderRadius: 8,
          fontWeight: 500,
          minWidth: 120,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === "light" 
            ? "0 2px 6px rgba(0,0,0,0.05)" 
            : "0 2px 6px rgba(0,0,0,0.3)",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: 16,
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "0.875rem", // Aumentado de 0.75rem a 0.875rem (14px)
          textTransform: "capitalize",
          borderRadius: 8,
          padding: "0 12px", // Más padding horizontal
          height: 32, // Aumentado de 24px a 32px
        },
        sizeSmall: {
          fontSize: "0.8125rem", // 13px
          height: 28,
          padding: "0 10px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            fontSize: "1rem", // Asegurar tamaño de fuente consistente
          },
          "& .MuiInputLabel-root": {
            fontSize: "1rem", // Labels más grandes
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.875rem", // Helper text más grande
          },
        },
      },
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: "1rem",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "1rem", // Items de menú más grandes
          padding: "12px 16px", // Más padding para mejor clickabilidad
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: "10px", // Aumentar área de click
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "1rem", // Labels de checkboxes y radios más grandes
        },
      },
    },
  },
});

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
