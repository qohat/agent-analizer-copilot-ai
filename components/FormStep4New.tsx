/**
 * FormStep4New: Datos del Domicilio
 */

'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { TIPOS_VIVIENDA, getNombreTipoVivienda, type TipoVivienda } from '@/lib/validation/step4-domicilio.schema'
import { MapPin, Home } from 'lucide-react'

export function FormStep4New() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const tipoVivienda = watch('tipoVivienda')

  // Limpiar campos cuando cambia el tipo de vivienda
  React.useEffect(() => {
    if (tipoVivienda && tipoVivienda !== 'arrendada') {
      setValue('nombrePropietario', '')
      setValue('valorArrendado', undefined)
    }
  }, [tipoVivienda, setValue])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Datos del Domicilio</h2>
        <p className="text-slate-400">Información sobre su lugar de residencia.</p>
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          Ubicación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="departamento" className="block text-sm font-medium text-slate-300">
              Departamento <span className="text-red-400">*</span>
            </label>
            <input
              id="departamento"
              type="text"
              placeholder="Ej: Antioquia"
              {...register('departamento')}
              className={errors.departamento ? 'border-red-500' : ''}
            />
            {errors.departamento && (
              <p className="text-sm text-red-400" role="alert">{String(errors.departamento.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="municipio" className="block text-sm font-medium text-slate-300">
              Municipio <span className="text-red-400">*</span>
            </label>
            <input
              id="municipio"
              type="text"
              placeholder="Ej: Medellín"
              {...register('municipio')}
              className={errors.municipio ? 'border-red-500' : ''}
            />
            {errors.municipio && (
              <p className="text-sm text-red-400" role="alert">{String(errors.municipio.message)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="direccion" className="block text-sm font-medium text-slate-300">
            Dirección completa <span className="text-red-400">*</span>
          </label>
          <input
            id="direccion"
            type="text"
            placeholder="Ej: Calle 10 # 20-30"
            {...register('direccion')}
            className={errors.direccion ? 'border-red-500' : ''}
          />
          {errors.direccion && (
            <p className="text-sm text-red-400" role="alert">{String(errors.direccion.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="barrioVereda" className="block text-sm font-medium text-slate-300">
            Barrio o Vereda <span className="text-red-400">*</span>
          </label>
          <input
            id="barrioVereda"
            type="text"
            placeholder="Ej: El Poblado"
            {...register('barrioVereda')}
            className={errors.barrioVereda ? 'border-red-500' : ''}
          />
          {errors.barrioVereda && (
            <p className="text-sm text-red-400" role="alert">{String(errors.barrioVereda.message)}</p>
          )}
        </div>
      </div>

      {/* Tipo de Vivienda */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Home className="w-5 h-5 text-emerald-400" />
          Tipo de Vivienda
        </h3>

        <div className="space-y-2">
          <label htmlFor="tipoVivienda" className="block text-sm font-medium text-slate-300">
            Tipo de vivienda
          </label>
          <select
            id="tipoVivienda"
            {...register('tipoVivienda')}
            className={errors.tipoVivienda ? 'border-red-500' : ''}
          >
            <option value="">Seleccione...</option>
            {Object.values(TIPOS_VIVIENDA).map((tipo) => (
              <option key={tipo} value={tipo}>
                {getNombreTipoVivienda(tipo as TipoVivienda)}
              </option>
            ))}
          </select>
          {errors.tipoVivienda && (
            <p className="text-sm text-red-400" role="alert">{String(errors.tipoVivienda.message)}</p>
          )}
        </div>

        {tipoVivienda === 'arrendada' && (
          <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <div className="space-y-2">
              <label htmlFor="nombrePropietario" className="block text-sm font-medium text-slate-300">
                Nombre del propietario <span className="text-red-400">*</span>
              </label>
              <input
                id="nombrePropietario"
                type="text"
                placeholder="Nombre completo del propietario"
                {...register('nombrePropietario')}
                className={errors.nombrePropietario ? 'border-red-500' : ''}
              />
              {errors.nombrePropietario && (
                <p className="text-sm text-red-400" role="alert">{String(errors.nombrePropietario.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="valorArrendado" className="block text-sm font-medium text-slate-300">
                Valor mensual del arriendo <span className="text-red-400">*</span>
              </label>
              <input
                id="valorArrendado"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="500000"
                {...register('valorArrendado', {
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
                className={errors.valorArrendado ? 'border-red-500' : ''}
              />
              {errors.valorArrendado && (
                <p className="text-sm text-red-400" role="alert">{String(errors.valorArrendado.message)}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
