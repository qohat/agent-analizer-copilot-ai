/**
 * FormStep5New: Datos del Negocio
 */

'use client'

import { useFormContext } from 'react-hook-form'
import { Briefcase } from 'lucide-react'

export function FormStep5New() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const direccionIgualCasa = watch('direccionIgualCasa')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Datos del Negocio</h2>
        <p className="text-slate-400">Información sobre su actividad económica.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-emerald-400" />
          Información General
        </h3>

        <div className="space-y-2">
          <label htmlFor="actividadEconomica" className="block text-sm font-medium">
            Actividad económica <span className="text-red-400">*</span>
          </label>
          <input
            id="actividadEconomica"
            type="text"
            placeholder="Ej: Comercio de productos agrícolas"
            {...register('actividadEconomica')}
            className={errors.actividadEconomica ? 'border-red-500' : ''}
          />
          {errors.actividadEconomica && (
            <p className="text-sm text-red-400" role="alert">{String(errors.actividadEconomica.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="numeroEmpleados" className="block text-sm font-medium">
              Número de empleados <span className="text-red-400">*</span>
            </label>
            <input
              id="numeroEmpleados"
              type="number"
              placeholder="0"
              {...register('numeroEmpleados', { valueAsNumber: true })}
              className={errors.numeroEmpleados ? 'border-red-500' : ''}
            />
            {errors.numeroEmpleados && (
              <p className="text-sm text-red-400" role="alert">{String(errors.numeroEmpleados.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="anosOperacion" className="block text-sm font-medium">
              Años de operación <span className="text-red-400">*</span>
            </label>
            <input
              id="anosOperacion"
              type="number"
              step="0.5"
              placeholder="0"
              {...register('anosOperacion', { valueAsNumber: true })}
              className={errors.anosOperacion ? 'border-red-500' : ''}
            />
            {errors.anosOperacion && (
              <p className="text-sm text-red-400" role="alert">{String(errors.anosOperacion.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="celularNegocio" className="block text-sm font-medium">
              Celular del negocio <span className="text-red-400">*</span>
            </label>
            <input
              id="celularNegocio"
              type="tel"
              placeholder="3001234567"
              {...register('celularNegocio')}
              className={errors.celularNegocio ? 'border-red-500' : ''}
            />
            {errors.celularNegocio && (
              <p className="text-sm text-red-400" role="alert">{String(errors.celularNegocio.message)}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg">
          <input
            id="direccionIgualCasa"
            type="checkbox"
            {...register('direccionIgualCasa')}
            className="w-4 h-4"
          />
          <label htmlFor="direccionIgualCasa" className="text-sm">
            La dirección del negocio es la misma que mi domicilio
          </label>
        </div>

        {!direccionIgualCasa && (
          <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <h4 className="font-medium text-sm">Ubicación del negocio</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="departamentoNegocio">Departamento</label>
                <input
                  id="departamentoNegocio"
                  type="text"
                  {...register('departamentoNegocio')}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="municipioNegocio">Municipio</label>
                <input
                  id="municipioNegocio"
                  type="text"
                  {...register('municipioNegocio')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="direccionNegocio">Dirección</label>
              <input
                id="direccionNegocio"
                type="text"
                {...register('direccionNegocio')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
