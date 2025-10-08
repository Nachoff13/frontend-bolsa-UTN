// app/layout.tsx

import type { Metadata } from "next";
import "@/styles/globals.css";
import { MuiThemeProvider } from "@/components/providers/mui";
import AppLayout from "@/components/layout/AppLayout";
import { SnackbarProvider } from "@/components/providers/snackbar";
import AuthGuard from "@/components/providers/AuthGuard";

export const metadata: Metadata = {
  title: "Bolsa de Trabajo UTN",
  description: "UTN FRLP",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="es">
      <body>
        <MuiThemeProvider>
          <SnackbarProvider>
            <AuthGuard>
              <AppLayout>{children}</AppLayout>
            </AuthGuard>
          </SnackbarProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
