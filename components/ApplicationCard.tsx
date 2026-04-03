import Link from 'next/link'
import { StatusBadge } from './StatusBadge'

interface ApplicationCardProps {
  id: string
  clientName: string
  businessName?: string
  applicationType?: string
  requestedAmount?: number
  status?: string
  createdAt?: string
  isDraft?: boolean
  href?: string
}

export function ApplicationCard({
  id,
  clientName,
  businessName,
  applicationType,
  requestedAmount,
  status,
  createdAt,
  isDraft = false,
  href = `/advisor/applications/${id}`,
}: ApplicationCardProps) {
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

  const getApplicationTypeLabel = (type?: string): string => {
    return type === 'commercial' ? 'Comercial' : type === 'agricultural' ? 'Agrícola' : 'Desconocida'
  }

  return (
    <Link href={href}>
      <div className="block bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 hover:bg-slate-800/70 transition">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Client Name */}
            <h3 className="font-semibold text-slate-100 mb-1 truncate">{clientName}</h3>

            {/* Business Name if available */}
            {businessName && (
              <p className="text-xs text-slate-500 mb-2 truncate">{businessName}</p>
            )}

            {/* Amount and Type */}
            <div className="flex items-center gap-4 text-sm mb-3">
              {applicationType && (
                <span className="text-slate-400">{getApplicationTypeLabel(applicationType)}</span>
              )}
              {requestedAmount && (
                <span className="font-medium text-emerald-400">{formatCurrency(requestedAmount)}</span>
              )}
            </div>

            {/* Date */}
            {createdAt && (
              <p className="text-xs text-slate-500">{formatDate(createdAt)}</p>
            )}
          </div>

          {/* Right Side: Status Badge */}
          <div className="flex-shrink-0 text-right space-y-2">
            <StatusBadge status={status} />
            {isDraft && (
              <p className="text-xs text-slate-500">En edición</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
