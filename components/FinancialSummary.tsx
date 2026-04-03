interface FinancialSummaryProps {
  primaryIncome?: number
  secondaryIncome?: number
  spouseIncome?: number
  personalExpenses?: number
  businessExpenses?: number
  otherObligations?: number
  compact?: boolean
}

export function FinancialSummary({
  primaryIncome = 0,
  secondaryIncome = 0,
  spouseIncome = 0,
  personalExpenses = 0,
  businessExpenses = 0,
  otherObligations = 0,
  compact = false,
}: FinancialSummaryProps) {
  const totalIncome = primaryIncome + secondaryIncome + spouseIncome
  const totalExpenses = personalExpenses + businessExpenses + otherObligations
  const netIncome = totalIncome - totalExpenses
  const debtToIncomeRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('es-CO')}`
  }

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Ingresos totales</p>
          <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Gastos totales</p>
          <p className="text-lg font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-slate-400 mb-1">Relación deuda-ingreso</p>
          <p className="text-lg font-bold text-slate-100">{debtToIncomeRatio}%</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Income Column */}
      <div className="space-y-4">
        <h3 className="font-semibold text-emerald-400">Ingresos mensuales</h3>
        <div className="space-y-2 text-sm">
          {primaryIncome > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Ingreso principal</span>
              <span className="font-medium text-slate-100">{formatCurrency(primaryIncome)}</span>
            </div>
          )}
          {secondaryIncome > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Ingreso secundario</span>
              <span className="font-medium text-slate-100">{formatCurrency(secondaryIncome)}</span>
            </div>
          )}
          {spouseIncome > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Ingreso del cónyuge</span>
              <span className="font-medium text-slate-100">{formatCurrency(spouseIncome)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-700 flex justify-between font-semibold">
            <span className="text-emerald-400">Total ingresos</span>
            <span className="text-emerald-400">{formatCurrency(totalIncome)}</span>
          </div>
        </div>
      </div>

      {/* Expenses Column */}
      <div className="space-y-4">
        <h3 className="font-semibold text-red-400">Gastos mensuales</h3>
        <div className="space-y-2 text-sm">
          {personalExpenses > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Gastos personales</span>
              <span className="font-medium text-slate-100">{formatCurrency(personalExpenses)}</span>
            </div>
          )}
          {businessExpenses > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Gastos del negocio</span>
              <span className="font-medium text-slate-100">{formatCurrency(businessExpenses)}</span>
            </div>
          )}
          {otherObligations > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-400">Otras obligaciones</span>
              <span className="font-medium text-slate-100">{formatCurrency(otherObligations)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-700 flex justify-between font-semibold">
            <span className="text-red-400">Total gastos</span>
            <span className="text-red-400">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Ingreso neto mensual</p>
          <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(netIncome)}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Relación deuda-ingreso</p>
          <p className="text-2xl font-bold text-slate-100">{debtToIncomeRatio}%</p>
        </div>
      </div>
    </div>
  )
}
