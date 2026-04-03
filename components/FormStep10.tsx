'use client'

import { useFormContext } from 'react-hook-form'
import { AlertCircle, TrendingUp } from 'lucide-react'

export function FormStep10() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  const currencyInput = (fieldName: string) => ({
    ...register(fieldName, { valueAsNumber: true }),
    type: 'number',
    placeholder: '0',
    className: 'px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right',
  })

  const paymentCapacityMonthly = watch('paymentCapacityMonthly') || 0
  const paymentCapacityPercent = watch('paymentCapacityPercent') || 0
  const debtToIncomeRatio = watch('debtToIncomeRatio') || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Capacidad de Pago</h2>
        <p className="text-slate-400 text-sm">Paso 10 de 11</p>
      </div>

      {/* PAYMENT CAPACITY METRICS */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Métricas de Capacidad de Pago</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Capacidad de Pago Mensual ($)
            </label>
            <input {...currencyInput('paymentCapacityMonthly')} />
            <p className="text-xs text-slate-400">
              Ingresos totales menos gastos esenciales
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Capacidad de Pago (% del Ingreso)
            </label>
            <input
              {...register('paymentCapacityPercent', { valueAsNumber: true })}
              type="number"
              placeholder="0"
              min="0"
              max="100"
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right"
            />
            <p className="text-xs text-slate-400">
              Porcentaje del ingreso disponible para crédito
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Índice de Endeudamiento (Deuda a Ingreso)
            </label>
            <input
              {...register('debtToIncomeRatio', { valueAsNumber: true })}
              type="number"
              placeholder="0.00"
              min="0"
              max="1"
              step="0.01"
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right"
            />
            <p className="text-xs text-slate-400">
              Deudas totales / Ingresos totales (0.0 = 0%, 1.0 = 100%)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Pago Mensual Propuesto ($)
            </label>
            <input {...currencyInput('requestedMonthlyPayment')} />
            <p className="text-xs text-slate-400">
              Se calcula según el monto y plazo solicitado
            </p>
          </div>
        </div>
      </div>

      {/* RISK INDICATORS */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Indicadores de Riesgo</h3>

        <div className="space-y-3">
          {/* DTI Ratio Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Índice Deuda-Ingreso (DTI)
              </label>
              <span className={`text-sm font-semibold ${
                debtToIncomeRatio <= 0.3 ? 'text-emerald-400' :
                debtToIncomeRatio <= 0.4 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {(debtToIncomeRatio * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  debtToIncomeRatio <= 0.3 ? 'bg-emerald-500' :
                  debtToIncomeRatio <= 0.4 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(debtToIncomeRatio * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {debtToIncomeRatio <= 0.3 ? '✓ Bajo riesgo' :
               debtToIncomeRatio <= 0.4 ? '⚠ Riesgo moderado' :
               '✗ Riesgo alto'}
            </p>
          </div>

          {/* Payment Capacity Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">
                Capacidad de Pago Disponible
              </label>
              <span className={`text-sm font-semibold ${
                paymentCapacityPercent >= 20 ? 'text-emerald-400' :
                paymentCapacityPercent >= 10 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {paymentCapacityPercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  paymentCapacityPercent >= 20 ? 'bg-emerald-500' :
                  paymentCapacityPercent >= 10 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(paymentCapacityPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {paymentCapacityPercent >= 20 ? '✓ Excelente' :
               paymentCapacityPercent >= 10 ? '⚠ Adecuada' :
               '✗ Limitada'}
            </p>
          </div>
        </div>
      </div>

      {/* GUIDELINES */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
        <div className="flex gap-3">
          <TrendingUp className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300 space-y-2">
            <p>
              <span className="font-semibold text-blue-300">Guías de Análisis:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Índice DTI ideal: 0% - 30% (óptimo)</li>
              <li>Índice DTI aceptable: 30% - 40% (moderado)</li>
              <li>Índice DTI alto riesgo: Mayor a 40%</li>
              <li>Capacidad de pago: Mayor al 15% es recomendado</li>
            </ul>
          </div>
        </div>
      </div>

      {/* WARNING */}
      {debtToIncomeRatio > 0.4 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-300">
            <p className="font-semibold">Alerta de Alto Endeudamiento</p>
            <p className="text-xs mt-1">
              El índice de deuda-ingreso está por encima de los umbrales recomendados.
              Esto puede afectar la aprobación del crédito.
            </p>
          </div>
        </div>
      )}

      {/* INFO BOX */}
      <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-xs text-slate-300">
        <p>
          <span className="font-semibold">Fórmulas de Cálculo:</span>
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2 text-slate-400">
          <li>Capacidad Mensual = Ingreso Total - Gastos Esenciales</li>
          <li>Índice DTI = Deuda Total / Ingreso Total</li>
          <li>% Capacidad = (Capacidad Mensual / Ingreso Total) × 100</li>
        </ul>
      </div>
    </div>
  )
}
