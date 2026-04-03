interface StatusBadgeProps {
  status?: string
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
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

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
        status
      )} ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}
