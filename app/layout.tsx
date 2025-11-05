// app/layout.tsx

import type { Metadata } from "next";
import "@/styles/globals.css";
import { MuiThemeProvider } from "@/components/providers/mui";
import { ThemeContextProvider } from "@/components/providers/ThemeProvider";
import AppLayout from "@/components/layout/AppLayout";
import { SnackbarProvider } from "@/components/providers/snackbar";
import AuthGuard from "@/components/providers/AuthGuard";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme-mode');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = mode === 'dark' || (!mode && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeContextProvider>
          <MuiThemeProvider>
            <SnackbarProvider>
              <AuthGuard>
                <NotificationProvider>
                  <AppLayout>{children}</AppLayout>
                </NotificationProvider>
              </AuthGuard>
            </SnackbarProvider>
          </MuiThemeProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
