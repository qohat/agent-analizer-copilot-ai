'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Clock, Search, Filter, ArrowRight, Loader2 } from 'lucide-react'

interface Application {
  id: string
  client_first_name?: string
  client_last_name?: string
  advisor?: { name: string }
  advisor_id?: string
  application_type?: string
  product_type?: string
  requested_amount?: number
  status?: string
  created_at?: string
  updated_at?: string
}

type StatusType = 'submitted' | 'under_review'

export default function ComiteApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [applicationTypeFilter, setApplicationTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all')

  useEffect(() => {
    fetchApplications()
  }, [statusFilter, applicationTypeFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const url = new URL('/api/applications?limit=100', window.location.origin)

      // Filter for pending review
      if (statusFilter !== 'all') {
        url.searchParams.set('status', statusFilter)
      } else {
        // Default: show submitted and under_review
        url.searchParams.set('status', 'submitted')
      }

      const response = await fetch(url.toString())
      if (!response.ok) throw new Error('Failed to fetch applications')

      const data = await response.json()
      let apps = data.applications || []

      // Filter by application type if needed
      if (applicationTypeFilter !== 'all') {
        apps = apps.filter((a: Application) => {
          const type = a.application_type || a.product_type
          return type === applicationTypeFilter
        })
      }

      setApplications(apps)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading applications')
      setApplications([])
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

  const filteredApplications = applications.filter((app) => {
    const clientName = `${app.client_first_name || ''} ${app.client_last_name || ''}`.toLowerCase()
    const advisorName = (app.advisor?.name || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    return clientName.includes(searchLower) || advisorName.includes(searchLower)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Solicitudes para revisar</h1>
        <p className="text-slate-400">Todas las solicitudes pendientes de aprobación del comité</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre o asesor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition"
          />
        </div>

        {/* Application Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <select
            value={applicationTypeFilter}
            onChange={(e) => setApplicationTypeFilter(e.target.value)}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-purple-500 focus:outline-none transition"
          >
            <option value="all">Todos los tipos</option>
            <option value="commercial">Comercial</option>
            <option value="agricultural">Agrícola</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusType | 'all')}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-purple-500 focus:outline-none transition"
          >
            <option value="all">Todos los estados</option>
            <option value="submitted">Enviadas</option>
            <option value="under_review">En revisión</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Cargando solicitudes...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
          <h3 className="text-red-400 font-semibold mb-2">Error</h3>
          <p className="text-slate-300">{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredApplications.length === 0 && (
        <div className="bg-slate-800/50 border border-dashed border-slate-700 rounded-lg p-12 text-center">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">
            {searchTerm ? 'No se encontraron solicitudes' : 'No hay solicitudes pendientes de revisión'}
          </p>
        </div>
      )}

      {/* Applications Table */}
      {!loading && !error && filteredApplications.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Solicitante</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Asesor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Días</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredApplications.map((app) => {
                const daysSinceSubmission = app.created_at
                  ? Math.floor(
                    (new Date().getTime() - new Date(app.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                  )
                  : 0

                return (
                  <tr key={app.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-100">
                        {app.client_first_name} {app.client_last_name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{app.advisor?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-300">
                      {app.application_type === 'commercial' || app.product_type === 'commercial' ? 'Comercial' : 'Agrícola'}
                    </td>
                    <td className="px-6 py-4 text-slate-100 font-medium">{formatCurrency(app.requested_amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{daysSinceSubmission} días</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Link
                          href={`/comite/applications/${app.id}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition flex items-center gap-2"
                        >
                          Revisar
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && filteredApplications.length > 0 && (
        <div className="text-sm text-slate-400 text-center py-4">
          Mostrando {filteredApplications.length} de {applications.length} solicitudes
        </div>
      )}
    </div>
  )
}
