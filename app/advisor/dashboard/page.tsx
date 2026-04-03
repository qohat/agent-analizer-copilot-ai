'use client'

import Link from 'next/link'
import { Plus, Clock, CheckCircle2, XCircle, TrendingUp, FileText, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'

// Mock data - replace with actual data fetching
const mockApplications = [
  {
    id: '1',
    clientName: 'Juan Pérez García',
    amount: 5000000,
    status: 'draft',
    lastUpdated: '2 horas atrás',
    progress: 80,
  },
  {
    id: '2',
    clientName: 'María López Rodríguez',
    amount: 3000000,
    status: 'submitted',
    lastUpdated: '1 día atrás',
    progress: 100,
  },
  {
    id: '3',
    clientName: 'Carlos Mendoza López',
    amount: 7500000,
    status: 'approved',
    lastUpdated: '3 días atrás',
    progress: 100,
  },
]

const stats = [
  { label: 'Solicitudes totales', value: '3', icon: FileText, color: 'emerald' },
  { label: 'En progreso', value: '1', icon: Clock, color: 'blue' },
  { label: 'Aprobadas', value: '1', icon: CheckCircle2, color: 'emerald' },
  { label: 'Tiempo promedio', value: '2.3 días', icon: TrendingUp, color: 'amber' },
]

export default function AdvisorDashboard() {
  const [offlineMode, setOfflineMode] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  const handleSync = async () => {
    setSyncStatus('syncing')
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSyncStatus('success')
    setTimeout(() => setSyncStatus('idle'), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-700 text-slate-200'
      case 'submitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-slate-700 text-slate-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'submitted':
        return 'Enviada'
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with CTA */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-400">Gestiona tus solicitudes de crédito</p>
        </div>
        <Link
          href="/advisor/application/new"
          className="px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva solicitud
        </Link>
      </div>

      {/* Sync Status Banner */}
      {offlineMode && (
        <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-300 font-medium">Modo offline activo</p>
            <p className="text-xs text-amber-400/80">Las solicitudes se sincronizarán cuando haya conexión</p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded text-sm hover:bg-amber-500/30 transition disabled:opacity-50"
          >
            {syncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar ahora'}
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          const colorClass = stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'blue' ? 'text-blue-400' : 'text-amber-400'
          return (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <Icon className={`w-5 h-5 ${colorClass}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Mis solicitudes</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition">
              Filtros
            </button>
            <button className="px-4 py-2 text-sm border border-slate-700 text-slate-300 rounded-lg hover:border-slate-600 transition">
              Ordenar
            </button>
          </div>
        </div>

        {mockApplications.length === 0 ? (
          <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-lg p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No tienes solicitudes aún</p>
            <Link
              href="/advisor/application/new"
              className="inline-block px-6 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400"
            >
              Crear la primera solicitud
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {mockApplications.map((app) => (
              <Link
                key={app.id}
                href={`/advisor/application/${app.id}`}
                className="block bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate">{app.clientName}</h3>
                    <p className="text-sm text-slate-400 mb-3">
                      Monto: ${app.amount.toLocaleString('es-CO')}
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{app.lastUpdated}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
