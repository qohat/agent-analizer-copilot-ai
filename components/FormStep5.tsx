'use client'

import { useFormContext } from 'react-hook-form'

export function FormStep5() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Revisión y envío</h2>
        <p className="text-slate-400 text-sm">Paso 5 de 5</p>
      </div>

      {/* Collateral Section */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300">Garantías/Colateral (opcional)</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Tipo de garantía
            </label>
            <select
              {...register('collateralType')}
              className={errors.collateralType ? 'border-red-500' : ''}
            >
              <option value="none">Ninguna</option>
              <option value="real_estate">Propiedad raíz</option>
              <option value="equipment">Equipo/Maquinaria</option>
              <option value="vehicles">Vehículos</option>
              <option value="inventory">Inventario</option>
              <option value="other">Otra</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Valor de la garantía ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('collateralValue', { valueAsNumber: true })}
              className={errors.collateralValue ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('insuranceInterest')}
            className="w-4 h-4 rounded border-slate-600"
          />
          <span className="text-sm text-slate-300">
            Interesa asegurar la garantía
          </span>
        </label>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Notas adicionales (opcional)
        </label>
        <textarea
          placeholder="Información relevante para el comité de crédito..."
          {...register('notes')}
          className={`h-24 resize-none ${errors.notes ? 'border-red-500' : ''}`}
        />
        {errors.notes && (
          <p className="text-sm text-red-400">{String(errors.notes.message)}</p>
        )}
      </div>

      {/* Terms */}
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-800/30 rounded-lg border border-slate-700 hover:border-slate-600 transition">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="w-4 h-4 rounded border-slate-600 mt-1 flex-shrink-0"
          />
          <span className="text-sm text-slate-300">
            Declaro que toda la información proporcionada es veraz y completa.
            Autorizo al comité de crédito a verificar los datos y tomar decisiones
            basadas en esta aplicación.
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-red-400">{String(errors.acceptTerms.message)}</p>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-emerald-300">¿Qué sucede después?</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">1.</span>
            <span>Tu solicitud se sincroniza automáticamente cuando haya internet</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">2.</span>
            <span>El comité de crédito realiza análisis de riesgo con IA</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">3.</span>
            <span>Recibirás notificación de decisión en 24-72 horas</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">4.</span>
            <span>Si es aprobada, el crédito se genera automáticamente</span>
          </li>
        </ul>
      </div>

      {/* Data Privacy Notice */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-400">
        <p>
          Tu información se almacena de forma segura y se protege con las políticas de privacidad
          de tu institución. Solo el comité de crédito y administradores autorizados pueden acceder.
        </p>
      </div>
    </div>
  )
}
