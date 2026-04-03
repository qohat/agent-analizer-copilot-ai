/**
 * FormStep2New: Tipo de Producto
 *
 * Permite seleccionar el tipo de crédito (comercial o agropecuario).
 * Esta selección determina qué formularios de apoyo se requieren después.
 */

'use client'

import { useFormContext } from 'react-hook-form'
import {
  getNombreTipoCredito,
  getDescripcionTipoCredito,
  getFormulariosRequeridos,
  TIPOS_CREDITO,
  type TipoCredito,
} from '@/lib/validation/step2-tipo-producto.schema'
import { Store, Sprout, AlertCircle, CheckCircle2 } from 'lucide-react'

export function FormStep2New() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const tipoCreditoSeleccionado = watch('tipoCredito') as TipoCredito | undefined

  const opciones: Array<{
    value: TipoCredito
    icon: typeof Store
    color: string
  }> = [
    {
      value: TIPOS_CREDITO.COMERCIAL,
      icon: Store,
      color: 'blue',
    },
    {
      value: TIPOS_CREDITO.AGROPECUARIO,
      icon: Sprout,
      color: 'green',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tipo de Producto</h2>
        <p className="text-slate-400">
          Seleccione el tipo de crédito que desea solicitar. Esta elección determina los
          formularios adicionales que deberá completar.
        </p>
      </div>

      {/* Selección de tipo de crédito */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Tipo de crédito <span className="text-red-400">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opciones.map((opcion) => {
            const Icon = opcion.icon
            const isSelected = tipoCreditoSeleccionado === opcion.value
            const colorClasses: Record<string, string> = {
              blue: isSelected
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-600 hover:border-blue-500/50',
              green: isSelected
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-600 hover:border-green-500/50',
            }

            return (
              <label
                key={opcion.value}
                className={`relative cursor-pointer border-2 rounded-lg p-6 transition-all ${
                  colorClasses[opcion.color]
                }`}
              >
                <input
                  type="radio"
                  value={opcion.value}
                  {...register('tipoCredito')}
                  className="sr-only"
                  aria-label={getNombreTipoCredito(opcion.value)}
                />

                <div className="flex flex-col items-center text-center space-y-3">
                  <Icon
                    className={`w-12 h-12 ${
                      isSelected
                        ? opcion.color === 'blue'
                          ? 'text-blue-400'
                          : 'text-green-400'
                        : 'text-slate-400'
                    }`}
                  />

                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {getNombreTipoCredito(opcion.value)}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {getDescripcionTipoCredito(opcion.value)}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                  )}
                </div>
              </label>
            )
          })}
        </div>

        {errors.tipoCredito && (
          <p className="text-red-400 text-sm flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4" />
            {String(errors.tipoCredito.message)}
          </p>
        )}
      </div>

      {/* Información sobre formularios requeridos */}
      {tipoCreditoSeleccionado && (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Formularios adicionales requeridos
          </h3>

          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              Para el <strong>{getNombreTipoCredito(tipoCreditoSeleccionado)}</strong>,
              deberá completar los siguientes formularios de apoyo:
            </p>

            <ul className="space-y-2">
              {getFormulariosRequeridos(tipoCreditoSeleccionado).map((formulario) => (
                <li
                  key={formulario}
                  className="flex items-start gap-2 text-sm text-emerald-300"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{formulario}</span>
                </li>
              ))}
            </ul>
          </div>

          {tipoCreditoSeleccionado === TIPOS_CREDITO.AGROPECUARIO && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-200">
                <strong>Nota:</strong> Los créditos agropecuarios requieren información
                adicional sobre cultivos, producción y flujo de caja proyectado.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información general */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <h3 className="font-medium text-blue-300 mb-2">ℹ️ Información importante</h3>
        <ul className="text-sm text-blue-200/80 space-y-1">
          <li>• Esta selección determina los formularios adicionales que deberá completar</li>
          <li>• Ambos tipos de crédito tienen las mismas condiciones de monto y plazo</li>
          <li>
            • La tasa de interés se definirá según el análisis de riesgo y el tipo de
            actividad
          </li>
          <li>• Puede cambiar su selección en cualquier momento durante el proceso</li>
        </ul>
      </div>
    </div>
  )
}
