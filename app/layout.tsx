import type { Metadata } from "next"
import "@/styles/globals.css"
import { MuiThemeProvider } from "@/components/providers/mui"  
export const metadata: Metadata = {
  title: "Bolsa de Trabajo UTN",
  description: "UTN FRLP",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </body>
    </html>
  )
}