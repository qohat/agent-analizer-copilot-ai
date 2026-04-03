interface RiskBadgeProps {
  level?: 'low' | 'medium' | 'high' | 'very_high'
  className?: string
}

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const getRiskColor = (level?: string): string => {
    switch (level) {
      case 'low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      case 'very_high':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-slate-700 text-slate-200'
    }
  }

  const getRiskLabel = (level?: string): string => {
    switch (level) {
      case 'low':
        return 'Riesgo bajo'
      case 'medium':
        return 'Riesgo medio'
      case 'high':
        return 'Riesgo alto'
      case 'very_high':
        return 'Riesgo muy alto'
      default:
        return 'Desconocido'
    }
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
        level
      )} ${className}`}
    >
      {getRiskLabel(level)}
    </span>
  )
}
