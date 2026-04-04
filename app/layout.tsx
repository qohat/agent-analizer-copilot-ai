import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Copiloto de Crédito',
  description: 'Asistente de IA para captura de solicitudes de crédito en campo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-950 text-slate-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
