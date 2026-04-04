/**
 * FormStep1: Datos de la Solicitud
 *
 * Este es el PRIMER PASO del formulario multi-step.
 * Captura los datos básicos de la solicitud de crédito.
 *
 * Campos (basado en JSON Schema step1_datos_solicitud):
 * - valorSolicitado (required)
 * - numeroCuotas (required)
 * - frecuencia (required)
 * - destino (required)
 * - diaPagoCuota (optional)
 */

'use client'

import { useFormContext } from 'react-hook-form'
import { useState, useEffect } from 'react'
import {
  formatCOP,
  estimarCuotaMensual,
  validarCapacidadPago
} from '@/lib/validation/step1-solicitud.schema'

export function FormStep1New() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  // Watch form values for real-time calculations
  const valorSolicitado = watch('valorSolicitado') || 0
  const numeroCuotas = watch('numeroCuotas') || 0
  const frecuencia = watch('frecuencia')

  // State for calculated values
  const [cuotaEstimada, setCuotaEstimada] = useState<number>(0)
  const [totalPagar, setTotalPagar] = useState<number>(0)

  // Calculate cuota estimada when values change
  useEffect(() => {
    if (valorSolicitado > 0 && numeroCuotas > 0) {
      // Tasa mensual ejemplo: 2.5% (30% EA aprox)
      const cuota = estimarCuotaMensual(valorSolicitado, numeroCuotas, 0.025)
      setCuotaEstimada(cuota)
      setTotalPagar(cuota * numeroCuotas)
    } else {
      setCuotaEstimada(0)
      setTotalPagar(0)
    }
  }, [valorSolicitado, numeroCuotas])

  // Frecuencias disponibles
  const frecuencias = [
    { value: 'mensual', label: 'Mensual', description: 'Una cuota por mes' },
    { value: 'quincenal', label: 'Quincenal', description: 'Dos cuotas por mes' },
    { value: 'semanal', label: 'Semanal', description: 'Cuatro cuotas por mes' }
  ]

  // Opciones de plazos comunes
  const plazosComunes = [6, 12, 18, 24, 36, 48, 60]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Datos de la Solicitud</h2>
        <p className="text-slate-400">
          Complete la información básica sobre el crédito que desea solicitar.
        </p>
      </div>

      {/* Valor Solicitado */}
      <div className="space-y-2">
        <label htmlFor="valorSolicitado" className="block text-sm font-medium text-slate-300">
          Monto del crédito solicitado *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
          <input
            id="valorSolicitado"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="5000000"
            {...register('valorSolicitado', {
              setValueAs: (v) => {
                const cleaned = String(v || '').replace(/[^0-9]/g, '')
                return cleaned === '' ? 0 : parseInt(cleaned, 10)
              },
            })}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault()
              }
            }}
            className={`pl-8 ${errors.valorSolicitado ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.valorSolicitado && (
          <p className="text-sm text-red-400">{String(errors.valorSolicitado.message)}</p>
        )}
        <p className="text-xs text-slate-400">
          Rango: {formatCOP(500000)} - {formatCOP(50000000)}
        </p>
      </div>

      {/* Número de Cuotas */}
      <div className="space-y-2">
        <label htmlFor="numeroCuotas" className="block text-sm font-medium text-slate-300">
          Plazo del crédito (número de cuotas) *
        </label>
        <select
          id="numeroCuotas"
          {...register('numeroCuotas', { valueAsNumber: true })}
          className={errors.numeroCuotas ? 'border-red-500' : ''}
        >
          <option value="">Seleccione el plazo...</option>
          {plazosComunes.map((plazo) => (
            <option key={plazo} value={plazo}>
              {plazo} cuotas ({Math.round(plazo / 12 * 10) / 10} años)
            </option>
          ))}
          <option value="custom">Otro plazo...</option>
        </select>
        {errors.numeroCuotas && (
          <p className="text-sm text-red-400">{String(errors.numeroCuotas.message)}</p>
        )}

        {/* Custom cuotas input (if "otro plazo" selected) */}
        {watch('numeroCuotas') === 'custom' && (
          <div className="mt-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Ingrese número de cuotas (3-60)"
              {...register('numeroCuotasCustom', {
                setValueAs: (v) => {
                  const cleaned = String(v || '').replace(/[^0-9]/g, '')
                  return cleaned === '' ? 0 : parseInt(cleaned, 10)
                },
              })}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                  e.preventDefault()
                }
              }}
              className="w-full"
            />
          </div>
        )}

        <p className="text-xs text-slate-400">
          Mínimo: 3 cuotas | Máximo: 60 cuotas
        </p>
      </div>

      {/* Frecuencia de Pago */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          Frecuencia de pago *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {frecuencias.map((freq) => (
            <label
              key={freq.value}
              className={`relative flex flex-col p-4 border-2 rounded-lg cursor-pointer transition ${
                frecuencia === freq.value
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <input
                type="radio"
                value={freq.value}
                {...register('frecuencia')}
                className="sr-only"
              />
              <span className="font-medium text-slate-300">{freq.label}</span>
              <span className="text-xs text-slate-400 mt-1">{freq.description}</span>
            </label>
          ))}
        </div>
        {errors.frecuencia && (
          <p className="text-sm text-red-400">{String(errors.frecuencia.message)}</p>
        )}
      </div>

      {/* Día de Pago (opcional, solo para frecuencia mensual/quincenal) */}
      {(frecuencia === 'mensual' || frecuencia === 'quincenal') && (
        <div className="space-y-2 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <label htmlFor="diaPagoCuota" className="block text-sm font-medium text-slate-300">
            Día de pago preferido (opcional)
          </label>
          <input
            id="diaPagoCuota"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="15"
            {...register('diaPagoCuota', {
              setValueAs: (v) => {
                const cleaned = String(v || '').replace(/[^0-9]/g, '')
                return cleaned === '' ? 0 : parseInt(cleaned, 10)
              },
            })}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault()
              }
            }}
            className={`w-32 ${errors.diaPagoCuota ? 'border-red-500' : ''}`}
          />
          {errors.diaPagoCuota && (
            <p className="text-sm text-red-400">{String(errors.diaPagoCuota.message)}</p>
          )}
          <p className="text-xs text-slate-400">
            Día del mes para realizar el pago (1-30)
          </p>
        </div>
      )}

      {/* Destino del Crédito */}
      <div className="space-y-2">
        <label htmlFor="destino" className="block text-sm font-medium text-slate-300">
          Destino del crédito *
        </label>
        <textarea
          id="destino"
          placeholder="Describa el propósito del crédito: capital de trabajo, compra de equipos, inversión en infraestructura, etc."
          {...register('destino')}
          className={`h-24 resize-none ${errors.destino ? 'border-red-500' : ''}`}
          maxLength={200}
        />
        {errors.destino && (
          <p className="text-sm text-red-400">{String(errors.destino.message)}</p>
        )}
        <p className="text-xs text-slate-400">
          {watch('destino')?.length || 0}/200 caracteres (mínimo 10)
        </p>
      </div>

      {/* Resumen de Cálculos */}
      {cuotaEstimada > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-emerald-300">Simulación del crédito</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Monto solicitado:</span>
              <span className="font-medium text-slate-200">{formatCOP(valorSolicitado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Plazo:</span>
              <span className="font-medium text-slate-200">{numeroCuotas} cuotas</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Frecuencia:</span>
              <span className="font-medium text-slate-200 capitalize">{frecuencia || '-'}</span>
            </div>
            <div className="border-t border-emerald-500/30 pt-2 flex justify-between">
              <span className="text-slate-300 font-medium">Cuota estimada:</span>
              <span className="text-emerald-400 font-bold">{formatCOP(cuotaEstimada)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total a pagar:</span>
              <span className="font-medium text-slate-200">{formatCOP(totalPagar)}</span>
            </div>
          </div>
          <p className="text-xs text-emerald-300/70 mt-2">
            * Cálculo estimado con tasa del 2.5% mensual (30% EA aprox). El monto exacto se definirá en el análisis.
          </p>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <h3 className="font-medium text-blue-300 mb-2">ℹ️ Información importante</h3>
        <ul className="text-sm text-blue-200/80 space-y-1">
          <li>• El monto mínimo de crédito es {formatCOP(500000)}</li>
          <li>• El monto máximo es {formatCOP(50000000)}</li>
          <li>• Los plazos disponibles van de 3 a 60 cuotas</li>
          <li>• La tasa de interés se definirá según el análisis de crédito</li>
          <li>• Se recomienda que la cuota no supere el 40-50% de sus ingresos mensuales</li>
        </ul>
      </div>
    </div>
  )
}
