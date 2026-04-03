'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'

interface DashboardStats {
  pendingReview: number
  reviewedToday: number
  approvalRate: number
  averageProcessingTime: number
}

interface Application {
  id: string
  client_first_name?: string
  client_last_name?: string
  requested_amount?: number
  status?: string
  created_at?: string
  updated_at?: string
  application_type?: string
  product_type?: string
}

export default function ComiteDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pendingReview: 0,
    reviewedToday: 0,
    approvalRate: 0,
    averageProcessingTime: 0,
  })
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all applications
      const response = await fetch('/api/applications?limit=100')
      if (!response.ok) throw new Error('Failed to fetch applications')

      const data = await response.json()
      const applications = data.applications || []

      // Calculate stats
      const pending = applications.filter((a: Application) => a.status === 'submitted' || a.status === 'under_review').length
      const approved = applications.filter((a: Application) => a.status === 'approved').length
      const rejected = applications.filter((a: Application) => a.status === 'rejected').length
      const total = approved + rejected
      const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

      // Get recent applications (last 10)
      const recent = applications.slice(0, 10)

      setStats({
        pendingReview: pending,
        reviewedToday: 0, // TODO: filter by today
        approvalRate,
        averageProcessingTime: 2.3, // TODO: calculate from dates
      })
      setRecentApplications(recent)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'under_review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50'
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-slate-700 text-slate-200'
    }
  }

  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case 'submitted':
        return 'Enviada'
      case 'under_review':
        return 'En revisión'
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      default:
        return status || 'Desconocida'
    }
  }

  const formatCurrency = (amount?: number): string => {
    if (!amount) return '$0'
    return `$${amount.toLocaleString('es-CO')}`
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    return date.toLocaleDateString('es-CO')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Panel de revisión del comité</h1>
        <p className="text-slate-400">Gestiona las solicitudes de crédito pendientes de aprobación</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-slate-300">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Pendientes de revisión</p>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold">{stats.pendingReview}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Revisadas hoy</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold">{stats.reviewedToday}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Tasa de aprobación</p>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold">{stats.approvalRate}%</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Tiempo promedio</p>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold">{stats.averageProcessingTime} días</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition">
          Riesgo alto
        </button>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition">
          Riesgo bajo
        </button>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition">
          Comercial
        </button>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm border border-slate-700 transition">
          Agrícola
        </button>
      </div>

      {/* Recent Applications */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Solicitudes recientes</h2>
          <Link
            href="/comite/applications"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
          >
            Ver todas →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-4">No hay solicitudes para revisar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Solicitante</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Monto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Fecha</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-100">
                      {app.client_first_name} {app.client_last_name}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {app.application_type === 'commercial' || app.product_type === 'commercial' ? 'Comercial' : 'Agrícola'}
                    </td>
                    <td className="px-6 py-4 text-slate-100 font-medium">{formatCurrency(app.requested_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(app.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/comite/applications/${app.id}`}
                        className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm rounded transition"
                      >
                        Revisar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
