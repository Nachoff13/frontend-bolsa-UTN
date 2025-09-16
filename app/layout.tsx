// app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";
import { MuiThemeProvider } from "@/components/providers/mui";
import AppLayout from "@/components/layout/AppLayout";
import { SnackbarProvider } from "@/components/providers/snackbar"; 

export const metadata: Metadata = {
  title: "Bolsa de Trabajo UTN",
  description: "UTN FRLP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <MuiThemeProvider>
          <SnackbarProvider> 
            <AppLayout>{children}</AppLayout>
          </SnackbarProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}