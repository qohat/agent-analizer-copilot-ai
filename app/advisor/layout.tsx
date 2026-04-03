import { OfflineIndicator } from '@/components/offline/OfflineIndicator'
import Link from 'next/link'

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <OfflineIndicator />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold text-emerald-400">COPILOTO</h1>
            <div className="text-sm text-slate-400">
              <span className="text-emerald-400 font-medium">Asesor</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-6">
            <Link
              href="/advisor/dashboard"
              className="text-sm text-slate-400 hover:text-slate-200 transition font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/advisor/applications"
              className="text-sm text-slate-400 hover:text-slate-200 transition font-medium"
            >
              Mis solicitudes
            </Link>
            <Link
              href="/advisor/application/new"
              className="text-sm text-slate-400 hover:text-slate-200 transition font-medium"
            >
              Nueva solicitud
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
