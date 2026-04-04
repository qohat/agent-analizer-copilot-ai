'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Search, Filter, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

interface Application {
  id: string
  business_name?: string
  client?: { first_name: string; last_name: string }
  client_first_name?: string
  client_last_name?: string
  application_type?: string
  product_type?: string
  requested_amount?: number
  status?: string
  created_at?: string
  updated_at?: string
}

type StatusType = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'

function ApplicationsListContent() {
  const router = useRouter()
  const { session } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all')

  useEffect(() => {
    if (session) {
      fetchApplications()
    }
  }, [statusFilter, session])

  const fetchApplications = async () => {
    try {
      setLoading(true)

      if (!session?.access_token) {
        setError('No autenticado')
        return
      }

      const url = new URL('/api/applications', window.location.origin)
      if (statusFilter !== 'all') {
        url.searchParams.set('status', statusFilter)
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data.applications || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading applications')
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const getClientName = (app: Application): string => {
    if (app.client && 'first_name' in app.client) {
      return `${app.client.first_name} ${app.client.last_name || ''}`
    }
    return `${app.client_first_name || ''} ${app.client_last_name || ''}`
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'draft':
        return 'bg-slate-700 text-slate-200'
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
      case 'draft':
        return 'Borrador'
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

  const getApplicationType = (app: Application): string => {
    const type = app.application_type || app.product_type || 'unknown'
    return type === 'commercial' ? 'Comercial' : type === 'agricultural' ? 'Agrícola' : 'Desconocida'
  }

  const filteredApplications = applications.filter((app) => {
    const clientName = getClientName(app).toLowerCase()
    const businessName = (app.business_name || '').toLowerCase()
    const searchLower = searchTerm.toLowerCase()
    return clientName.includes(searchLower) || businessName.includes(searchLower)
  })

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount?: number): string => {
    if (!amount) return '$0'
    return `$${amount.toLocaleString('es-CO')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mis solicitudes</h1>
          <p className="text-slate-400">Gestiona todas tus solicitudes de crédito</p>
        </div>
        <Link
          href="/advisor/application/new"
          className="px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva solicitud
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre de cliente o negocio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusType | 'all')}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-emerald-500 focus:outline-none transition"
          >
            <option value="all">Todos los estados</option>
            <option value="draft">Borradores</option>
            <option value="submitted">Enviadas</option>
            <option value="under_review">En revisión</option>
            <option value="approved">Aprobadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
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
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron solicitudes con los filtros aplicados'
              : 'No tienes solicitudes aún'}
          </p>
          <Link
            href="/advisor/application/new"
            className="inline-block px-6 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition"
          >
            Crear la primera solicitud
          </Link>
        </div>
      )}

      {/* Applications Table */}
      {!loading && !error && filteredApplications.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-400">Fecha</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-800/50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-100">{getClientName(app)}</p>
                      {app.business_name && (
                        <p className="text-xs text-slate-500">{app.business_name}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {getApplicationType(app)}
                  </td>
                  <td className="px-6 py-4 text-slate-100 font-medium">
                    {formatCurrency(app.requested_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {formatDate(app.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {app.status === 'draft' && (
                        <Link
                          href={`/advisor/applications/${app.id}/edit`}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 text-sm rounded transition"
                        >
                          Continuar
                        </Link>
                      )}
                      <Link
                        href={`/advisor/applications/${app.id}`}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-sm rounded transition flex items-center gap-2"
                      >
                        Ver
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
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

export default function ApplicationsListPage() {
  return (
    <ProtectedRoute allowedRoles={['advisor', 'admin']}>
      <ApplicationsListContent />
    </ProtectedRoute>
  )
}
