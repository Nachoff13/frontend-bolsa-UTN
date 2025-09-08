"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import {
  SnackbarType,
  SnackbarSize,
  SnackbarPosition,
} from "@/types/enums/snackbar";

type SnackbarContextType = {
  showMessage: (
    message: string,
    severity?: SnackbarType,
    options?: {
      position?: SnackbarPosition;
      size?: SnackbarSize;
    }
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error("Problemas al usar el contexto del Snackbar");
  return context;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarType>(SnackbarType.Info);
  const [position, setPosition] = useState<SnackbarPosition>(
    SnackbarPosition.BottomCenter
  );
  const [size, setSize] = useState<SnackbarSize>(SnackbarSize.Medium);

  const showMessage = (
    msg: string,
    sev: SnackbarType = SnackbarType.Info,
    options?: {
      position?: SnackbarPosition;
      size?: SnackbarSize;
    }
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setPosition(options?.position ?? SnackbarPosition.BottomCenter);
    setSize(options?.size ?? SnackbarSize.Medium);
    setOpen(true);
  };

  const [vertical, horizontal] = position.split("-") as [
    "top" | "bottom",
    "left" | "center" | "right"
  ];

  const getAlertStyles = () => {
    switch (size) {
      case SnackbarSize.Small:
        return { fontSize: "0.75rem", padding: "6px 12px" };
      case SnackbarSize.Medium:
        return { fontSize: "1rem", padding: "8px 16px" };
      case SnackbarSize.XLarge:
        return { fontSize: "1.25rem", padding: "12px 20px", fontWeight: 600 };
      default:
        return {};
    }
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          sx={{ width: "100%", whiteSpace: "pre-line", ...getAlertStyles() }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
