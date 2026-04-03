'use client'

import { calculateCommercialMetrics, generateCommercialCashFlowProjection, CommercialMetrics } from '@/lib/calculations'
import { useMemo } from 'react'

interface AnalysisCommercialProps {
  applicationData: any
}

export function AnalysisCommercial({ applicationData }: AnalysisCommercialProps) {
  // Normalize field names (database returns snake_case)
  const normalizedData = useMemo(() => ({
    businessName: applicationData.business_name || applicationData.businessName,
    requestedAmount: applicationData.requested_amount || applicationData.requestedAmount,
    loanTermMonths: applicationData.requested_months || applicationData.loanTermMonths,
    primaryIncomeMonthly: applicationData.client_monthly_income || applicationData.primaryIncomeMonthly || 0,
    secondaryIncomeMonthly: applicationData.secondary_income_monthly || applicationData.secondaryIncomeMonthly || 0,
    spouseIncomeMonthly: applicationData.spouse_monthly_income || applicationData.spouseIncomeMonthly || 0,
    householdExpensesMonthly: applicationData.monthly_personal_expenses || applicationData.householdExpensesMonthly || 0,
    businessExpensesMonthly: applicationData.monthly_business_expenses || applicationData.businessExpensesMonthly || 0,
    debtObligationsMonthly: applicationData.monthly_other_obligations || applicationData.debtObligationsMonthly || 0,
    businessMonthsInOperation: applicationData.business_years_operating || applicationData.businessMonthsInOperation || 0,
    accountsReceivableAmount: applicationData.accounts_receivable_amount || applicationData.accountsReceivableAmount || 0,
    accountsReceivableDays: applicationData.accounts_receivable_days || applicationData.accountsReceivableDays || 0,
    accountsPayableAmount: applicationData.accounts_payable_amount || applicationData.accountsPayableAmount || 0,
    accountsPayableDays: applicationData.accounts_payable_days || applicationData.accountsPayableDays || 0,
    inventoryValue: applicationData.inventory_value || applicationData.inventoryValue || 0,
    inventoryDays: applicationData.inventory_days || applicationData.inventoryDays || 0,
    collateralValue: applicationData.collateral_value || applicationData.collateralValue || 0,
    businessProfitMargin: applicationData.business_profit_margin || applicationData.businessProfitMargin || 0,
  }), [applicationData])

  const metrics = useMemo(() => calculateCommercialMetrics(normalizedData), [normalizedData])
  const cashFlowProjection = useMemo(
    () => generateCommercialCashFlowProjection(applicationData, metrics),
    [applicationData, metrics]
  )

  const recommendationColor = metrics.recommendation === 'GO'
    ? 'text-emerald-400 bg-emerald-500/10'
    : metrics.recommendation === 'CAUTION'
    ? 'text-yellow-400 bg-yellow-500/10'
    : 'text-red-400 bg-red-500/10'

  const recommendationLabel = metrics.recommendation === 'GO'
    ? 'APROBAR'
    : metrics.recommendation === 'CAUTION'
    ? 'EVALUAR CON CUIDADO'
    : 'RECHAZAR'

  return (
    <div className="space-y-6">
      {/* Business Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Nombre del negocio</p>
          <p className="text-xl font-semibold text-slate-100">{applicationData.businessName}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Tipo de crédito</p>
          <p className="text-xl font-semibold text-slate-100">Comercial</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Monto solicitado</p>
          <p className="text-xl font-semibold text-emerald-400">
            ${applicationData.requestedAmount?.toLocaleString('es-CO')}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Plazo</p>
          <p className="text-xl font-semibold text-slate-100">{applicationData.loanTermMonths} meses</p>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Ingreso bruto mensual</p>
          <p className="text-2xl font-bold text-emerald-400">
            ${metrics.grossIncome.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Principal: ${applicationData.primaryIncomeMonthly?.toLocaleString('es-CO')}
            {applicationData.secondaryIncomeMonthly > 0 && ` + Secundario: $${applicationData.secondaryIncomeMonthly?.toLocaleString('es-CO')}`}
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Gastos totales mensual</p>
          <p className="text-2xl font-bold text-red-400">
            ${metrics.totalExpenses.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Hogar: ${applicationData.householdExpensesMonthly?.toLocaleString('es-CO')} + Negocio: ${applicationData.businessExpensesMonthly?.toLocaleString('es-CO')}
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Ingreso neto mensual</p>
          <p className={`text-2xl font-bold ${metrics.netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${metrics.netIncome.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Después de todos los gastos
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Cuota mensual estimada</p>
          <p className="text-2xl font-bold text-slate-100">
            ${metrics.monthlyPayment.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {applicationData.loanTermMonths} meses @ 25% anual
          </p>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`border rounded-lg p-4 ${
          metrics.debtToIncomeRatio <= 0.30
            ? 'bg-emerald-500/10 border-emerald-500/50'
            : metrics.debtToIncomeRatio <= 0.40
            ? 'bg-yellow-500/10 border-yellow-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <p className="text-slate-400 text-sm mb-1">Relación Deuda-Ingreso</p>
          <p className="text-2xl font-bold">
            {(metrics.debtToIncomeRatio * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {metrics.debtToIncomeRatio <= 0.30
              ? 'EXCELENTE (< 30%)'
              : metrics.debtToIncomeRatio <= 0.40
              ? 'ACEPTABLE (30-40%)'
              : 'RIESGO (> 40%)'}
          </p>
        </div>

        <div className={`border rounded-lg p-4 ${
          metrics.paymentCapacityPercent >= 50
            ? 'bg-emerald-500/10 border-emerald-500/50'
            : metrics.paymentCapacityPercent >= 20
            ? 'bg-yellow-500/10 border-yellow-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <p className="text-slate-400 text-sm mb-1">Capacidad de Pago</p>
          <p className="text-2xl font-bold">
            {metrics.paymentCapacityPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Ingreso disponible post-cuota
          </p>
        </div>

        <div className={`border rounded-lg p-4 ${
          metrics.workingCapital >= 0
            ? 'bg-emerald-500/10 border-emerald-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <p className="text-slate-400 text-sm mb-1">Capital de Trabajo</p>
          <p className="text-2xl font-bold">
            ${(metrics.workingCapital / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-slate-400 mt-2">
            {metrics.workingCapital >= 0 ? 'POSITIVO' : 'NEGATIVO'}
          </p>
        </div>
      </div>

      {/* Working Capital Cycle */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <h3 className="font-medium text-slate-300 mb-4">Ciclo de Conversión de Efectivo</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-slate-400 text-xs mb-1">Días por cobrar</p>
            <p className="text-2xl font-bold text-blue-400">{metrics.daysReceivableOutstanding}</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-slate-400 text-2xl">+</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Días inventario</p>
            <p className="text-2xl font-bold text-blue-400">{metrics.daysInventoryOutstanding}</p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-slate-400 text-2xl">-</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs mb-1">Días por pagar</p>
            <p className="text-2xl font-bold text-blue-400">{metrics.daysPayableOutstanding}</p>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-4 pt-4">
          <p className="text-slate-400 text-sm text-center mb-1">Ciclo total de conversión</p>
          <p className="text-3xl font-bold text-center text-slate-100">
            {metrics.cashConversionCycle} días
          </p>
          <p className="text-xs text-slate-400 text-center mt-2">
            {metrics.cashConversionCycle <= 30
              ? 'Excelente: Efectivo disponible rápidamente'
              : metrics.cashConversionCycle <= 60
              ? 'Aceptable: Conversión moderada'
              : 'Alto: Largo tiempo en conversión de efectivo'}
          </p>
        </div>
      </div>

      {/* Cash Flow Projection */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <h3 className="font-medium text-slate-300 mb-4">Proyección de flujo de efectivo (12 meses)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 py-2 px-2">Mes</th>
                <th className="text-right text-slate-400 py-2 px-2">Ingresos</th>
                <th className="text-right text-slate-400 py-2 px-2">Egresos</th>
                <th className="text-right text-slate-400 py-2 px-2">Neto</th>
                <th className="text-right text-slate-400 py-2 px-2">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowProjection.slice(0, 6).map((month, idx) => (
                <tr key={idx} className="border-b border-slate-700/50">
                  <td className="py-2 px-2 text-slate-300">M{month.month}</td>
                  <td className="text-right py-2 px-2 text-emerald-400">
                    ${(month.inflow / 1000).toFixed(0)}K
                  </td>
                  <td className="text-right py-2 px-2 text-red-400">
                    ${(month.outflow / 1000).toFixed(0)}K
                  </td>
                  <td className={`text-right py-2 px-2 font-medium ${
                    month.netCash >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    ${(month.netCash / 1000).toFixed(0)}K
                  </td>
                  <td className={`text-right py-2 px-2 font-medium ${
                    month.cumulativeCash >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    ${(month.cumulativeCash / 1000).toFixed(0)}K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Factors */}
      <div className={`border rounded-lg p-4 ${
        metrics.riskFactors.length === 0
          ? 'bg-emerald-500/10 border-emerald-500/50'
          : metrics.riskFactors.length <= 2
          ? 'bg-yellow-500/10 border-yellow-500/50'
          : 'bg-red-500/10 border-red-500/50'
      }`}>
        <h3 className="font-medium text-slate-300 mb-3">Factores de riesgo identificados</h3>
        {metrics.riskFactors.length === 0 ? (
          <p className="text-emerald-300 text-sm">Sin factores de riesgo relevantes identificados</p>
        ) : (
          <ul className="space-y-2">
            {metrics.riskFactors.map((factor, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-200">
                <span className="text-red-400 font-bold">•</span>
                {factor}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recommendation */}
      <div className={`border-2 rounded-lg p-6 ${recommendationColor}`}>
        <p className="text-slate-400 text-sm mb-2">Recomendación del análisis</p>
        <p className="text-3xl font-bold mb-3">{recommendationLabel}</p>
        <p className="text-sm">
          {metrics.recommendation === 'GO'
            ? 'Solicitante cumple con criterios de crédito. Se recomienda presentar al comité de aprobación.'
            : metrics.recommendation === 'CAUTION'
            ? 'Solicitante presenta algunos riesgos. Requiere revisión del comité y posibles condiciones adicionales.'
            : 'Solicitante no cumple con criterios de crédito. Se recomienda rechazar o solicitar información adicional.'}
        </p>
      </div>
    </div>
  )
}
