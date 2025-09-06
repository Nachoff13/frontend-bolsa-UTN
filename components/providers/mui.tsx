"use client";

import { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00658f", // Azul UTN
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c2185b", // Híbrido
    },
    info: {
      main: "#00bcd4", // Part Time
    },
    warning: {
      main: "#ffa726", // Presencial
    },
    error: {
      main: "#ef5350", // Full Time
    },
    background: {
      default: "#f9fafa", // Fondo general
      paper: "#f0f8f9", // Fondos secundarios
    },
    text: {
      primary: "#222",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    h4: {
      fontWeight: 700,
    },
    body2: {
      color: "#555",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: 8,
          fontWeight: 500,
          minWidth: 120,
        },
        outlined: {
          backgroundColor: "#ffffff",
          color: "#222",
          borderColor: "#ccc",
          borderRadius: 8,
          fontWeight: 500,
          minWidth: 120,

          "&:hover": {
            backgroundColor: "#f4f4f4",
            borderColor: "#aaa",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          backgroundColor: "#f0f8f9",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#f0f8f9",
          padding: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "0.75rem",
          textTransform: "capitalize",
          borderRadius: 8,
          padding: "0 8px",
          height: 24,
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
