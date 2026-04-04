/**
 * FormStep5New: Datos del Negocio
 */

'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Briefcase } from 'lucide-react'

export function FormStep5New() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()

  const direccionIgualCasa = watch('direccionIgualCasa')

  // Campos del domicilio (Step 4)
  const departamento = watch('departamento')
  const municipio = watch('municipio')
  const direccion = watch('direccion')
  const barrioVereda = watch('barrioVereda')

  // Poblar automáticamente cuando se marca el checkbox
  React.useEffect(() => {
    if (direccionIgualCasa) {
      setValue('departamentoNegocio', departamento || '')
      setValue('municipioNegocio', municipio || '')
      setValue('direccionNegocio', direccion || '')
      setValue('barrioVeredaNegocio', barrioVereda || '')
    }
  }, [direccionIgualCasa, departamento, municipio, direccion, barrioVereda, setValue])

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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              {...register('numeroEmpleados', {
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
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              {...register('anosOperacion', {
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
            <h4 className="font-medium text-sm">Ubicación del negocio <span className="text-red-400">*</span></h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="departamentoNegocio" className="block text-sm font-medium">
                  Departamento <span className="text-red-400">*</span>
                </label>
                <input
                  id="departamentoNegocio"
                  type="text"
                  placeholder="Ej: Antioquia"
                  {...register('departamentoNegocio')}
                  className={errors.departamentoNegocio ? 'border-red-500' : ''}
                />
                {errors.departamentoNegocio && (
                  <p className="text-sm text-red-400" role="alert">{String(errors.departamentoNegocio.message)}</p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="municipioNegocio" className="block text-sm font-medium">
                  Municipio <span className="text-red-400">*</span>
                </label>
                <input
                  id="municipioNegocio"
                  type="text"
                  placeholder="Ej: Medellín"
                  {...register('municipioNegocio')}
                  className={errors.municipioNegocio ? 'border-red-500' : ''}
                />
                {errors.municipioNegocio && (
                  <p className="text-sm text-red-400" role="alert">{String(errors.municipioNegocio.message)}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="direccionNegocio" className="block text-sm font-medium">
                Dirección <span className="text-red-400">*</span>
              </label>
              <input
                id="direccionNegocio"
                type="text"
                placeholder="Ej: Calle 10 # 20-30"
                {...register('direccionNegocio')}
                className={errors.direccionNegocio ? 'border-red-500' : ''}
              />
              {errors.direccionNegocio && (
                <p className="text-sm text-red-400" role="alert">{String(errors.direccionNegocio.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="barrioVeredaNegocio" className="block text-sm font-medium">
                Barrio o Vereda (opcional)
              </label>
              <input
                id="barrioVeredaNegocio"
                type="text"
                placeholder="Ej: El Poblado"
                {...register('barrioVeredaNegocio')}
              />
            </div>
          </div>
        )}

        {direccionIgualCasa && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <p className="text-sm text-emerald-300">
              ✓ Se usará la misma dirección de su domicilio para el negocio
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
