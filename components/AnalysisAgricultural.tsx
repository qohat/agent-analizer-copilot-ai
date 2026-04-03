'use client'

import { calculateAgriculturalMetrics, generateAgriculturalSeasonalPattern, AgriculturalMetrics } from '@/lib/calculations'
import { useMemo } from 'react'

interface AnalysisAgriculturalProps {
  applicationData: any
}

export function AnalysisAgricultural({ applicationData }: AnalysisAgriculturalProps) {
  // Normalize field names (database returns snake_case)
  const normalizedData = useMemo(() => ({
    businessName: applicationData.business_name || applicationData.businessName,
    requestedAmount: applicationData.requested_amount || applicationData.requestedAmount,
    loanTermMonths: applicationData.requested_months || applicationData.loanTermMonths,
    cropLivestockType: applicationData.crop_livestock_type || applicationData.cropLivestockType,
    lastHarvestAmount: applicationData.last_harvest_amount || applicationData.lastHarvestAmount || 0,
    marketPriceAverage: applicationData.market_price_average || applicationData.marketPriceAverage || 0,
    productionCostsPerCycle: applicationData.production_costs_per_cycle || applicationData.productionCostsPerCycle || 0,
    productionCyclesPerYear: applicationData.production_cycles_per_year || applicationData.productionCyclesPerYear || 1,
    irrigationCosts: applicationData.irrigation_costs || applicationData.irrigationCosts || 0,
    feedFertilizerCosts: applicationData.feed_fertilizer_costs || applicationData.feedFertilizerCosts || 0,
    veterinaryCosts: applicationData.veterinary_costs || applicationData.veterinaryCosts || 0,
    storagePostHarvestCosts: applicationData.storage_post_harvest_costs || applicationData.storagePostHarvestCosts || 0,
    distributionTransportationCosts: applicationData.distribution_transportation_costs || applicationData.distributionTransportationCosts || 0,
    householdExpensesMonthly: applicationData.monthly_personal_expenses || applicationData.householdExpensesMonthly || 0,
    debtObligationsMonthly: applicationData.monthly_other_obligations || applicationData.debtObligationsMonthly || 0,
    collateralValue: applicationData.collateral_value || applicationData.collateralValue || 0,
  }), [applicationData])

  const metrics = useMemo(() => calculateAgriculturalMetrics(normalizedData), [normalizedData])
  const seasonalPattern = useMemo(
    () => generateAgriculturalSeasonalPattern(applicationData),
    [applicationData]
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
      {/* Farm Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Nombre de la finca/negocio</p>
          <p className="text-xl font-semibold text-slate-100">{applicationData.businessName}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Tipo de crédito</p>
          <p className="text-xl font-semibold text-slate-100">Agropecuario</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Cultivo/Ganadería</p>
          <p className="text-xl font-semibold text-slate-100">
            {applicationData.cropLivestockType || 'No especificado'}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Ciclos por año</p>
          <p className="text-xl font-semibold text-slate-100">
            {applicationData.productionCyclesPerYear || 1}
          </p>
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
          <p className="text-slate-400 text-sm mb-2">Ingreso bruto anual</p>
          <p className="text-2xl font-bold text-emerald-400">
            ${metrics.annualGrossIncome.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Última cosecha: {applicationData.lastHarvestAmount?.toLocaleString('es-CO')} unidades
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Costos anuales</p>
          <p className="text-2xl font-bold text-red-400">
            ${metrics.annualProductionCosts.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Por ciclo: ${applicationData.productionCostsPerCycle?.toLocaleString('es-CO')}
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Ganancia neta anual</p>
          <p className={`text-2xl font-bold ${metrics.annualNetProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${metrics.annualNetProfit.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Después de costos de producción
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-2">Cuota mensual estimada</p>
          <p className="text-2xl font-bold text-slate-100">
            ${((metrics.annualNetProfit / 12) / (applicationData.loanTermMonths || 24) * applicationData.loanTermMonths).toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {applicationData.loanTermMonths} meses @ 25% anual
          </p>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`border rounded-lg p-4 ${
          metrics.debtToIncomeRatio <= 0.30
            ? 'bg-emerald-500/10 border-emerald-500/50'
            : metrics.debtToIncomeRatio <= 0.40
            ? 'bg-yellow-500/10 border-yellow-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <p className="text-slate-400 text-sm mb-1">Relación Deuda-Ingreso (Anual)</p>
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
          metrics.lowSeasonPaymentCapacity >= 0
            ? 'bg-emerald-500/10 border-emerald-500/50'
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <p className="text-slate-400 text-sm mb-1">Capacidad de Pago (Época Baja)</p>
          <p className={`text-2xl font-bold ${
            metrics.lowSeasonPaymentCapacity >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            ${metrics.lowSeasonPaymentCapacity.toLocaleString('es-CO')}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Mensual después de gastos + cuota
          </p>
        </div>
      </div>

      {/* Seasonal Income Pattern */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <h3 className="font-medium text-slate-300 mb-4">Patrón de ingresos mensuales (Proyección)</h3>
        <div className="grid grid-cols-12 gap-1">
          {seasonalPattern.map((month, idx) => {
            const maxIncome = Math.max(...seasonalPattern.map(m => m.income))
            const percentage = (month.income / maxIncome) * 100

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-6 h-24 bg-slate-700 rounded-t overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full transition-all ${
                        month.isHarvestMonth ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ height: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">M{month.month}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 justify-center mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded" />
            <span className="text-slate-400">Mes de cosecha</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-slate-400">Otros meses</span>
          </div>
        </div>
      </div>

      {/* Production Details */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <h3 className="font-medium text-slate-300 mb-4">Detalles de producción</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 mb-1">Cantidad última cosecha</p>
            <p className="text-lg font-semibold text-slate-100">
              {applicationData.lastHarvestAmount?.toLocaleString('es-CO')} unidades
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Precio promedio unitario</p>
            <p className="text-lg font-semibold text-slate-100">
              ${applicationData.marketPriceAverage?.toLocaleString('es-CO')}
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Costo por ciclo</p>
            <p className="text-lg font-semibold text-slate-100">
              ${applicationData.productionCostsPerCycle?.toLocaleString('es-CO')}
            </p>
          </div>
          <div>
            <p className="text-slate-400 mb-1">Duración del ciclo</p>
            <p className="text-lg font-semibold text-slate-100">
              {(12 / (applicationData.productionCyclesPerYear || 1)).toFixed(0)} meses
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
        <h3 className="font-medium text-slate-300 mb-4">Desglose de costos anuales</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Costos de producción:</span>
            <span className="text-slate-100">
              ${((applicationData.productionCostsPerCycle || 0) * (applicationData.productionCyclesPerYear || 1)).toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Riego:</span>
            <span className="text-slate-100">
              ${((applicationData.irrigationCosts || 0) * (applicationData.productionCyclesPerYear || 1)).toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Alimentos/Fertilizantes:</span>
            <span className="text-slate-100">
              ${((applicationData.feedFertilizerCosts || 0) * (applicationData.productionCyclesPerYear || 1)).toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Veterinarios:</span>
            <span className="text-slate-100">
              ${((applicationData.veterinaryCosts || 0) * (applicationData.productionCyclesPerYear || 1)).toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Almacenamiento/Post-cosecha:</span>
            <span className="text-slate-100">
              ${((applicationData.storagePostHarvestCosts || 0) * (applicationData.productionCyclesPerYear || 1)).toLocaleString('es-CO')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Transporte/Distribución:</span>
            <span className="text-slate-100">
              ${((applicationData.distributionTransportationCosts || 0) * (applicationData.productionCyclesPerYear || 1)).toLocaleString('es-CO')}
            </span>
          </div>
          <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between font-semibold">
            <span className="text-slate-300">Total anual:</span>
            <span className="text-emerald-400">
              ${metrics.annualProductionCosts.toLocaleString('es-CO')}
            </span>
          </div>
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
            ? 'Solicitante agropecuario cumple con criterios de crédito. Se recomienda presentar al comité de aprobación.'
            : metrics.recommendation === 'CAUTION'
            ? 'Solicitante agropecuario presenta riesgos estacionales o de producción. Requiere revisión del comité con condiciones especiales.'
            : 'Solicitante no cumple con criterios de crédito agropecuario. Se recomienda rechazar o solicitar información adicional.'}
        </p>
      </div>
    </div>
  )
}
