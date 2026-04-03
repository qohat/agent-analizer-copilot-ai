'use client'

import { useFormContext } from 'react-hook-form'
import { useState } from 'react'

export function FormStep2() {
  const { formState: { errors }, register, watch } = useFormContext<any>()
  const hasSpouse = watch('hasSpouse')

  const idTypes = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'dni', label: 'DNI' },
    { value: 'nit', label: 'NIT' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Cónyuge o co-obligado</h2>
        <p className="text-slate-400 text-sm">Paso 2 de 5</p>
      </div>

      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('hasSpouse')}
            className="w-4 h-4 rounded border-slate-600"
          />
          <span className="text-sm font-medium text-slate-300">
            ¿Tiene cónyuge o co-obligado?
          </span>
        </label>
      </div>

      {hasSpouse && (
        <div className="space-y-6 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <div className="grid grid-cols-2 gap-4">
            {/* Spouse First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre *
              </label>
              <input
                type="text"
                placeholder="María"
                {...register('spouseFirstName')}
                className={errors.spouseFirstName ? 'border-red-500' : ''}
              />
              {errors.spouseFirstName && (
                <p className="text-sm text-red-400">{String(errors.spouseFirstName.message)}</p>
              )}
            </div>

            {/* Spouse Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Apellido *
              </label>
              <input
                type="text"
                placeholder="García"
                {...register('spouseLastName')}
                className={errors.spouseLastName ? 'border-red-500' : ''}
              />
              {errors.spouseLastName && (
                <p className="text-sm text-red-400">{String(errors.spouseLastName.message)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Spouse ID Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Tipo de ID *
              </label>
              <select
                {...register('spouseIdType')}
                className={errors.spouseIdType ? 'border-red-500' : ''}
              >
                <option value="">Selecciona...</option>
                {idTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.spouseIdType && (
                <p className="text-sm text-red-400">{String(errors.spouseIdType.message)}</p>
              )}
            </div>

            {/* Spouse ID Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Número de ID *
              </label>
              <input
                type="text"
                placeholder="0987654321"
                {...register('spouseIdNumber')}
                className={errors.spouseIdNumber ? 'border-red-500' : ''}
              />
              {errors.spouseIdNumber && (
                <p className="text-sm text-red-400">{String(errors.spouseIdNumber.message)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Spouse Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="+573009876543"
                {...register('spousePhone')}
                className={errors.spousePhone ? 'border-red-500' : ''}
              />
              {errors.spousePhone && (
                <p className="text-sm text-red-400">{String(errors.spousePhone.message)}</p>
              )}
            </div>

            {/* Spouse Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Correo (opcional)
              </label>
              <input
                type="email"
                placeholder="maria@ejemplo.com"
                {...register('spouseEmail')}
                className={errors.spouseEmail ? 'border-red-500' : ''}
              />
              {errors.spouseEmail && (
                <p className="text-sm text-red-400">{String(errors.spouseEmail.message)}</p>
              )}
            </div>
          </div>

          {/* From Excel: Solicitud de Crédito, Section 6 - Spouse Date of Birth (CRITICAL) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Fecha de nacimiento del cónyuge (opcional)
            </label>
            <input
              type="date"
              {...register('spouseDateOfBirth')}
              className={errors.spouseDateOfBirth ? 'border-red-500' : ''}
            />
            {errors.spouseDateOfBirth && (
              <p className="text-sm text-red-400">{String(errors.spouseDateOfBirth.message)}</p>
            )}
          </div>

          {/* From Excel: Solicitud de Crédito, Section 6 - Spouse ID Issue City */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Ciudad de expedición (opcional)
              </label>
              <input
                type="text"
                placeholder="Bogotá"
                {...register('spouseIdIssuedCity')}
                className={errors.spouseIdIssuedCity ? 'border-red-500' : ''}
              />
              {errors.spouseIdIssuedCity && (
                <p className="text-sm text-red-400">{String(errors.spouseIdIssuedCity.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Fecha de expedición (opcional)
              </label>
              <input
                type="date"
                {...register('spouseIdIssuedDate')}
                className={errors.spouseIdIssuedDate ? 'border-red-500' : ''}
              />
              {errors.spouseIdIssuedDate && (
                <p className="text-sm text-red-400">{String(errors.spouseIdIssuedDate.message)}</p>
              )}
            </div>
          </div>

          {/* Spouse Relationship Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Relación con el solicitante (opcional)
            </label>
            <select
              {...register('spouseRelationship')}
              className={errors.spouseRelationship ? 'border-red-500' : ''}
            >
              <option value="">Selecciona...</option>
              <option value="spouse">Cónyuge</option>
              <option value="co_obligor">Co-obligado/a</option>
            </select>
            {errors.spouseRelationship && (
              <p className="text-sm text-red-400">{String(errors.spouseRelationship.message)}</p>
            )}
          </div>
        </div>
      )}

      {/* From Excel: Solicitud de Crédito, Section 7 - Co-applicant (Optional) */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('hasCoapplicant')}
            className="w-4 h-4 rounded border-slate-600"
          />
          <span className="text-sm font-medium text-slate-300">
            ¿Desea agregar un co-deudor?
          </span>
        </label>
      </div>

      {watch('hasCoapplicant') && (
        <div className="space-y-6 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <h3 className="font-medium text-slate-300">Información del co-deudor</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Co-applicant First Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre *
              </label>
              <input
                type="text"
                placeholder="Pedro"
                {...register('coapplicantFirstName')}
                className={errors.coapplicantFirstName ? 'border-red-500' : ''}
              />
              {errors.coapplicantFirstName && (
                <p className="text-sm text-red-400">{String(errors.coapplicantFirstName.message)}</p>
              )}
            </div>

            {/* Co-applicant Last Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Apellido *
              </label>
              <input
                type="text"
                placeholder="Rodríguez"
                {...register('coapplicantLastName')}
                className={errors.coapplicantLastName ? 'border-red-500' : ''}
              />
              {errors.coapplicantLastName && (
                <p className="text-sm text-red-400">{String(errors.coapplicantLastName.message)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Co-applicant ID Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Tipo de ID *
              </label>
              <select
                {...register('coapplicantIdType')}
                className={errors.coapplicantIdType ? 'border-red-500' : ''}
              >
                <option value="">Selecciona...</option>
                {idTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.coapplicantIdType && (
                <p className="text-sm text-red-400">{String(errors.coapplicantIdType.message)}</p>
              )}
            </div>

            {/* Co-applicant ID Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Número de ID *
              </label>
              <input
                type="text"
                placeholder="1234567890"
                {...register('coapplicantIdNumber')}
                className={errors.coapplicantIdNumber ? 'border-red-500' : ''}
              />
              {errors.coapplicantIdNumber && (
                <p className="text-sm text-red-400">{String(errors.coapplicantIdNumber.message)}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Co-applicant Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Teléfono *
              </label>
              <input
                type="tel"
                placeholder="+573001234567"
                {...register('coapplicantPhone')}
                className={errors.coapplicantPhone ? 'border-red-500' : ''}
              />
              {errors.coapplicantPhone && (
                <p className="text-sm text-red-400">{String(errors.coapplicantPhone.message)}</p>
              )}
            </div>

            {/* Co-applicant Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Correo (opcional)
              </label>
              <input
                type="email"
                placeholder="pedro@ejemplo.com"
                {...register('coapplicantEmail')}
                className={errors.coapplicantEmail ? 'border-red-500' : ''}
              />
              {errors.coapplicantEmail && (
                <p className="text-sm text-red-400">{String(errors.coapplicantEmail.message)}</p>
              )}
            </div>
          </div>

          {/* Co-applicant Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Fecha de nacimiento (opcional)
            </label>
            <input
              type="date"
              {...register('coapplicantDateOfBirth')}
              className={errors.coapplicantDateOfBirth ? 'border-red-500' : ''}
            />
            {errors.coapplicantDateOfBirth && (
              <p className="text-sm text-red-400">{String(errors.coapplicantDateOfBirth.message)}</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          Si el solicitante es casado o está en unión libre, recomendamos incluir al cónyuge.
          Esto mejora la evaluación del crédito.
        </p>
      </div>
    </div>
  )
}
