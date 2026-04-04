'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { FileText, PlusCircle, LogOut, User } from 'lucide-react'

function DashboardContent() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleNewApplication = () => {
    router.push('/advisor/new-application')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Agent Analyzer Copilot</h1>
              <p className="text-sm text-slate-400">Dashboard de Asesor</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
                <User className="w-5 h-5 text-emerald-400" />
                <div className="text-sm">
                  <p className="font-medium text-white">{user?.name || user?.email}</p>
                  <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 border border-slate-700 text-slate-300 rounded-lg hover:border-red-500 hover:text-red-400 transition">
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-white mb-8">Bienvenido</h2>
        <button onClick={handleNewApplication} className="px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition">
          Nueva Solicitud
        </button>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['advisor', 'admin']}>
      <DashboardContent />
    </ProtectedRoute>
  )
}
