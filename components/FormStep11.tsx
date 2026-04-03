'use client'

import { useFormContext } from 'react-hook-form'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export function FormStep11() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  const requestedAmount = watch('requestedAmount') || 0
  const requestedMonths = watch('requestedMonths') || 24
  const acceptTerms = watch('acceptTerms') || false

  // Simple interest calculation (annual rate assumed at 12% for demo)
  const annualRate = 0.12
  const monthlyRate = annualRate / 12
  const monthlyPayment = requestedAmount > 0
    ? (requestedAmount * (monthlyRate * Math.pow(1 + monthlyRate, requestedMonths))) /
      (Math.pow(1 + monthlyRate, requestedMonths) - 1)
    : 0

  const totalInterest = (monthlyPayment * requestedMonths) - requestedAmount
  const totalRepayment = requestedAmount + totalInterest

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Propuesta de Crédito y Decisión</h2>
        <p className="text-slate-400 text-sm">Paso 11 de 11 - Última revisión</p>
      </div>

      {/* CREDIT REQUEST */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Solicitud de Crédito</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Monto Solicitado ($) *
            </label>
            <input
              {...register('requestedAmount', { valueAsNumber: true })}
              type="number"
              placeholder="0"
              min="0"
              step="1000"
              className={`w-full px-3 py-2 bg-slate-700 border rounded text-white placeholder-slate-400 text-right ${
                errors.requestedAmount ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {errors.requestedAmount && (
              <p className="text-sm text-red-400">{String(errors.requestedAmount.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Plazo en Meses *
            </label>
            <select
              {...register('requestedMonths', { valueAsNumber: true })}
              className={`w-full px-3 py-2 bg-slate-700 border rounded text-white ${
                errors.requestedMonths ? 'border-red-500' : 'border-slate-600'
              }`}
            >
              {[3, 6, 12, 24, 36, 48, 60].map((months) => (
                <option key={months} value={months}>
                  {months} meses
                </option>
              ))}
            </select>
            {errors.requestedMonths && (
              <p className="text-sm text-red-400">{String(errors.requestedMonths.message)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Propósito del Crédito (opcional)
          </label>
          <select
            {...register('requestedPurpose')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
          >
            <option value="">Selecciona un propósito</option>
            <option value="capital_trabajo">Capital de Trabajo</option>
            <option value="expansion_negocio">Expansión del Negocio</option>
            <option value="equipo_maquinaria">Equipo y Maquinaria</option>
            <option value="inventario">Inventario</option>
            <option value="consolidacion_deuda">Consolidación de Deuda</option>
            <option value="infraestructura">Infraestructura</option>
            <option value="mejora_vivienda">Mejora de Vivienda</option>
            <option value="educacion">Educación</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Detalles de Uso (opcional)
          </label>
          <textarea
            {...register('requestedUseDetail')}
            placeholder="Describe en detalle cómo usarás este crédito..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 h-24 resize-none"
          />
        </div>
      </div>

      {/* CREDIT SUMMARY */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Resumen de la Propuesta de Crédito
        </h3>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4 border-b border-slate-700 pb-4">
            <div>
              <p className="text-slate-400 text-xs uppercase">Monto Solicitado</p>
              <p className="text-lg font-semibold text-emerald-300">
                ${requestedAmount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase">Plazo</p>
              <p className="text-lg font-semibold text-emerald-300">
                {requestedMonths} meses
              </p>
            </div>
          </div>

          <div className="space-y-2 bg-slate-900/50 p-3 rounded">
            <div className="flex justify-between">
              <span className="text-slate-400">Tasa Anual (Demo):</span>
              <span className="font-semibold">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Pago Mensual Estimado:</span>
              <span className="font-semibold text-emerald-300">
                ${monthlyPayment.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-700 pt-2">
              <span className="text-slate-400">Intereses Totales:</span>
              <span className="font-semibold text-yellow-300">
                ${totalInterest.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">Total a Repagar:</span>
              <span className="font-bold text-lg text-emerald-300">
                ${totalRepayment.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 bg-slate-900/50 p-2 rounded">
          Nota: Estos valores son estimados. La tasa final y términos dependen de la aprobación del comité de crédito.
        </p>
      </div>

      {/* ADVISOR NOTES */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300">Notas del Asesor</h3>

        <textarea
          {...register('notes')}
          placeholder="Agrega cualquier observación o nota importante sobre esta solicitud..."
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 h-20 resize-none"
        />
      </div>

      {/* TERMS & CONDITIONS */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 mb-4">Confirmación y Términos</h3>

        <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-900/50 rounded border border-slate-700 hover:border-slate-600 transition">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className={`w-4 h-4 rounded border-slate-600 mt-1 flex-shrink-0 ${
              errors.acceptTerms ? 'border-red-500' : ''
            }`}
          />
          <span className="text-sm text-slate-300">
            Declaro que toda la información proporcionada en esta solicitud de crédito es veraz,
            completa y exacta. Autorizo al comité de crédito a verificar los datos, realizar
            consultas con terceros y tomar decisiones basadas en esta información.
            He leído y aceptado los términos y condiciones de la institución financiera.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-red-400">{String(errors.acceptTerms.message)}</p>
        )}
      </div>

      {/* NEXT STEPS */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-blue-300">¿Qué sucede después de enviar?</h3>
        <ol className="space-y-3 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold flex-shrink-0">1.</span>
            <span>Tu solicitud se sincroniza automáticamente cuando haya conexión a internet</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold flex-shrink-0">2.</span>
            <span>El comité de crédito realiza análisis automático de riesgo usando IA</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold flex-shrink-0">3.</span>
            <span>Se valida capacidad de pago, score crediticio y garantías</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold flex-shrink-0">4.</span>
            <span>Recibirás notificación de decisión en 24-72 horas por SMS/Email</span>
          </li>
          <li className="flex gap-3">
            <span className="text-blue-400 font-bold flex-shrink-0">5.</span>
            <span>Si es aprobada, el crédito se genera automáticamente</span>
          </li>
        </ol>
      </div>

      {/* FINAL CHECKLIST */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-300">Verificación Final:</p>
        <ul className="space-y-1 ml-2">
          <li>✓ Todos los datos personales completos</li>
          <li>✓ Información financiera verificada</li>
          <li>✓ Términos y condiciones aceptados</li>
          <li>✓ Monto y plazo definidos</li>
          <li>✓ Listo para envío al comité</li>
        </ul>
      </div>
    </div>
  )
}
