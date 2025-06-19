// import { UserProvider } from '@auth0/nextjs-auth0/client'
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Bolsa de Trabajo UTN',
  description: 'Sistema de bolsa de trabajo para estudiantes y empresas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
} 