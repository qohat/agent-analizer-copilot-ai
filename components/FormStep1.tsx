'use client'

import { useFormContext } from 'react-hook-form'

export function FormStep1() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  const idTypes = [
    { value: 'cedula', label: 'Cédula' },
    { value: 'passport', label: 'Pasaporte' },
    { value: 'dni', label: 'DNI' },
    { value: 'nit', label: 'NIT' },
  ]

  const departments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
    'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
    'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander',
    'Putumayo', 'Quindío', 'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
    'Vaupés', 'Vichada'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Información del cliente</h2>
        <p className="text-slate-400 text-sm">Paso 1 de 5</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Nombre *
          </label>
          <input
            type="text"
            placeholder="Juan"
            {...register('clientFirstName')}
            className={errors.clientFirstName ? 'border-red-500' : ''}
          />
          {errors.clientFirstName && (
            <p className="text-sm text-red-400">{String(errors.clientFirstName.message)}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Apellido *
          </label>
          <input
            type="text"
            placeholder="Pérez"
            {...register('clientLastName')}
            className={errors.clientLastName ? 'border-red-500' : ''}
          />
          {errors.clientLastName && (
            <p className="text-sm text-red-400">{String(errors.clientLastName.message)}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* ID Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Tipo de ID *
          </label>
          <select
            {...register('clientIdType')}
            className={errors.clientIdType ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            {idTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.clientIdType && (
            <p className="text-sm text-red-400">{String(errors.clientIdType.message)}</p>
          )}
        </div>

        {/* ID Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Número de ID *
          </label>
          <input
            type="text"
            placeholder="1234567890"
            {...register('clientIdNumber')}
            className={errors.clientIdNumber ? 'border-red-500' : ''}
          />
          {errors.clientIdNumber && (
            <p className="text-sm text-red-400">{String(errors.clientIdNumber.message)}</p>
          )}
        </div>
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Fecha de nacimiento *
        </label>
        <input
          type="date"
          {...register('clientDateOfBirth')}
          className={errors.clientDateOfBirth ? 'border-red-500' : ''}
        />
        {errors.clientDateOfBirth && (
          <p className="text-sm text-red-400">{String(errors.clientDateOfBirth.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Teléfono *
          </label>
          <input
            type="tel"
            placeholder="+573001234567"
            {...register('clientPhone')}
            className={errors.clientPhone ? 'border-red-500' : ''}
          />
          {errors.clientPhone && (
            <p className="text-sm text-red-400">{String(errors.clientPhone.message)}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Correo (opcional)
          </label>
          <input
            type="email"
            placeholder="juan@ejemplo.com"
            {...register('clientEmail')}
            className={errors.clientEmail ? 'border-red-500' : ''}
          />
          {errors.clientEmail && (
            <p className="text-sm text-red-400">{String(errors.clientEmail.message)}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Dirección *
        </label>
        <input
          type="text"
          placeholder="Calle 10 #5-20"
          {...register('addressStreet')}
          className={errors.addressStreet ? 'border-red-500' : ''}
        />
        {errors.addressStreet && (
          <p className="text-sm text-red-400">{String(errors.addressStreet.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* City */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Ciudad *
          </label>
          <input
            type="text"
            placeholder="Neiva"
            {...register('addressCity')}
            className={errors.addressCity ? 'border-red-500' : ''}
          />
          {errors.addressCity && (
            <p className="text-sm text-red-400">{String(errors.addressCity.message)}</p>
          )}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Departamento *
          </label>
          <select
            {...register('addressDepartment')}
            className={errors.addressDepartment ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.addressDepartment && (
            <p className="text-sm text-red-400">{String(errors.addressDepartment.message)}</p>
          )}
        </div>
      </div>

      {/* From Excel: Solicitud de Crédito, Section 4 - Postal Code */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Código postal (opcional)
        </label>
        <input
          type="text"
          placeholder="123456"
          {...register('addressPostalCode')}
          className={errors.addressPostalCode ? 'border-red-500' : ''}
        />
        {errors.addressPostalCode && (
          <p className="text-sm text-red-400">{String(errors.addressPostalCode.message)}</p>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 4 - Residence Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Tipo de vivienda (opcional)
        </label>
        <select
          {...register('residenceType')}
          className={errors.residenceType ? 'border-red-500' : ''}
        >
          <option value="">Selecciona...</option>
          <option value="propia">Propia</option>
          <option value="arrendada">Arrendada</option>
          <option value="familiar">Familiar</option>
        </select>
        {errors.residenceType && (
          <p className="text-sm text-red-400">{String(errors.residenceType.message)}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* From Excel: Solicitud de Crédito, Section 4 - Years of Residence */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Años de residencia (opcional)
          </label>
          <input
            type="number"
            placeholder="5"
            {...register('residenceYears', { valueAsNumber: true })}
            className={errors.residenceYears ? 'border-red-500' : ''}
          />
          {errors.residenceYears && (
            <p className="text-sm text-red-400">{String(errors.residenceYears.message)}</p>
          )}
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Estado civil *
          </label>
          <select
            {...register('maritalStatus')}
            className={errors.maritalStatus ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="single">Soltero/a</option>
            <option value="married">Casado/a</option>
            <option value="common_law">Unión libre</option>
            <option value="divorced">Divorciado/a</option>
            <option value="widowed">Viudo/a</option>
          </select>
          {errors.maritalStatus && (
            <p className="text-sm text-red-400">{String(errors.maritalStatus.message)}</p>
          )}
        </div>
      </div>

      {/* From Excel: Solicitud de Crédito, Section 4 - Conditional: If residence is arrendada */}
      {watch('residenceType') === 'arrendada' && (
        <div className="space-y-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre del propietario *
              </label>
              <input
                type="text"
                placeholder="Carlos García"
                {...register('landlordName')}
                className={errors.landlordName ? 'border-red-500' : ''}
              />
              {errors.landlordName && (
                <p className="text-sm text-red-400">{String(errors.landlordName.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Monto de arriendo ($) *
              </label>
              <input
                type="number"
                placeholder="400000"
                {...register('rentAmount', { valueAsNumber: true })}
                className={errors.rentAmount ? 'border-red-500' : ''}
              />
              {errors.rentAmount && (
                <p className="text-sm text-red-400">{String(errors.rentAmount.message)}</p>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Género (opcional)
          </label>
          <select
            {...register('clientGender')}
            className={errors.clientGender ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="other">Otro</option>
          </select>
          {errors.clientGender && (
            <p className="text-sm text-red-400">{String(errors.clientGender.message)}</p>
          )}
        </div>

        {/* Education Level */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Nivel educativo (opcional)
          </label>
          <select
            {...register('clientEducationLevel')}
            className={errors.clientEducationLevel ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="primary">Primaria</option>
            <option value="secondary">Secundaria</option>
            <option value="technical">Técnico</option>
            <option value="university">Universidad</option>
          </select>
          {errors.clientEducationLevel && (
            <p className="text-sm text-red-400">{String(errors.clientEducationLevel.message)}</p>
          )}
        </div>
      </div>

      {/* Employment Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Estado laboral actual *
        </label>
        <select
          {...register('clientEmploymentStatus')}
          className={errors.clientEmploymentStatus ? 'border-red-500' : ''}
        >
          <option value="">Selecciona...</option>
          <option value="employed">Empleado</option>
          <option value="self_employed">Trabajador independiente</option>
          <option value="unemployed">Desempleado</option>
          <option value="retired">Jubilado</option>
        </select>
        {errors.clientEmploymentStatus && (
          <p className="text-sm text-red-400">{String(errors.clientEmploymentStatus.message)}</p>
        )}
      </div>
    </div>
  )
}
