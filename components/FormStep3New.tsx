/**
 * FormStep3New: Datos Personales del Solicitante
 *
 * Formulario completo para capturar información personal del solicitante.
 * Organizado en secciones para mejor UX.
 */

'use client'

import { useFormContext } from 'react-hook-form'
import {
  TIPOS_DOCUMENTO,
  NIVELES_EDUCACION,
  ESTADOS_CIVILES,
  GENEROS,
  getNombreTipoDocumento,
  getNombreEducacion,
  getNombreEstadoCivil,
  getNombreGenero,
  calcularEdad,
  formatearCelular,
  type TipoDocumento,
  type NivelEducacion,
  type EstadoCivil,
  type Genero,
} from '@/lib/validation/step3-datos-personales.schema'
import { AlertCircle, User, Mail, Phone, GraduationCap, Heart } from 'lucide-react'

export function FormStep3New() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()

  const fechaNacimiento = watch('fechaNacimiento')
  const edad = fechaNacimiento ? calcularEdad(fechaNacimiento) : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Datos Personales del Solicitante</h2>
        <p className="text-slate-400">
          Complete su información personal. Todos los campos marcados con * son obligatorios.
        </p>
      </div>

      {/* Sección 1: Identificación */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" />
          Identificación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Documento */}
          <div className="space-y-2">
            <label htmlFor="tipoDocumento" className="block text-sm font-medium text-slate-300">
              Tipo de documento
            </label>
            <select
              id="tipoDocumento"
              {...register('tipoDocumento')}
              className={errors.tipoDocumento ? 'border-red-500' : ''}
            >
              {Object.entries(TIPOS_DOCUMENTO).map(([key, value]) => (
                <option key={value} value={value}>
                  {getNombreTipoDocumento(value as TipoDocumento)}
                </option>
              ))}
            </select>
            {errors.tipoDocumento && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.tipoDocumento.message)}
              </p>
            )}
          </div>

          {/* Cédula */}
          <div className="space-y-2">
            <label htmlFor="cedula" className="block text-sm font-medium text-slate-300">
              Número de documento <span className="text-red-400">*</span>
            </label>
            <input
              id="cedula"
              type="text"
              placeholder="1234567890"
              {...register('cedula')}
              className={errors.cedula ? 'border-red-500' : ''}
            />
            {errors.cedula && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.cedula.message)}
              </p>
            )}
          </div>
        </div>

        {/* Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="primerNombre" className="block text-sm font-medium text-slate-300">
              Primer nombre <span className="text-red-400">*</span>
            </label>
            <input
              id="primerNombre"
              type="text"
              placeholder="Juan"
              {...register('primerNombre')}
              className={errors.primerNombre ? 'border-red-500' : ''}
            />
            {errors.primerNombre && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.primerNombre.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="segundoNombre" className="block text-sm font-medium text-slate-300">
              Segundo nombre
            </label>
            <input
              id="segundoNombre"
              type="text"
              placeholder="Carlos"
              {...register('segundoNombre')}
              className={errors.segundoNombre ? 'border-red-500' : ''}
            />
            {errors.segundoNombre && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.segundoNombre.message)}
              </p>
            )}
          </div>
        </div>

        {/* Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="primerApellido" className="block text-sm font-medium text-slate-300">
              Primer apellido <span className="text-red-400">*</span>
            </label>
            <input
              id="primerApellido"
              type="text"
              placeholder="García"
              {...register('primerApellido')}
              className={errors.primerApellido ? 'border-red-500' : ''}
            />
            {errors.primerApellido && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.primerApellido.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="segundoApellido" className="block text-sm font-medium text-slate-300">
              Segundo apellido
            </label>
            <input
              id="segundoApellido"
              type="text"
              placeholder="López"
              {...register('segundoApellido')}
              className={errors.segundoApellido ? 'border-red-500' : ''}
            />
            {errors.segundoApellido && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.segundoApellido.message)}
              </p>
            )}
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-slate-300">
              Fecha de nacimiento <span className="text-red-400">*</span>
            </label>
            <input
              id="fechaNacimiento"
              type="date"
              {...register('fechaNacimiento')}
              className={errors.fechaNacimiento ? 'border-red-500' : ''}
            />
            {errors.fechaNacimiento && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.fechaNacimiento.message)}
              </p>
            )}
            {edad && edad >= 18 && (
              <p className="text-xs text-emerald-400">Edad: {edad} años</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="nacionalidad" className="block text-sm font-medium text-slate-300">
              Nacionalidad <span className="text-red-400">*</span>
            </label>
            <input
              id="nacionalidad"
              type="text"
              placeholder="Colombiana"
              defaultValue="Colombiana"
              {...register('nacionalidad')}
              className={errors.nacionalidad ? 'border-red-500' : ''}
            />
            {errors.nacionalidad && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.nacionalidad.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-400" />
          Información de Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Correo */}
          <div className="space-y-2">
            <label htmlFor="correo" className="block text-sm font-medium text-slate-300">
              Correo electrónico <span className="text-red-400">*</span>
            </label>
            <input
              id="correo"
              type="email"
              placeholder="correo@example.com"
              {...register('correo')}
              className={errors.correo ? 'border-red-500' : ''}
            />
            {errors.correo && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.correo.message)}
              </p>
            )}
          </div>

          {/* Celular */}
          <div className="space-y-2">
            <label htmlFor="celular" className="block text-sm font-medium text-slate-300">
              Número celular <span className="text-red-400">*</span>
            </label>
            <input
              id="celular"
              type="tel"
              placeholder="3001234567"
              {...register('celular')}
              className={errors.celular ? 'border-red-500' : ''}
            />
            {errors.celular && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.celular.message)}
              </p>
            )}
            <p className="text-xs text-slate-400">
              Debe ser un número colombiano (10 dígitos empezando con 3)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="telefonoFijo" className="block text-sm font-medium text-slate-300">
            Teléfono fijo (opcional)
          </label>
          <input
            id="telefonoFijo"
            type="tel"
            placeholder="6012345678"
            {...register('telefonoFijo')}
            className={`md:w-1/2 ${errors.telefonoFijo ? 'border-red-500' : ''}`}
          />
          {errors.telefonoFijo && (
            <p className="text-sm text-red-400" role="alert">
              {String(errors.telefonoFijo.message)}
            </p>
          )}
        </div>
      </div>

      {/* Sección 3: Información Personal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
          Información Adicional
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ocupación */}
          <div className="space-y-2">
            <label htmlFor="ocupacion" className="block text-sm font-medium text-slate-300">
              Ocupación <span className="text-red-400">*</span>
            </label>
            <input
              id="ocupacion"
              type="text"
              placeholder="Comerciante, Agricultor, etc."
              {...register('ocupacion')}
              className={errors.ocupacion ? 'border-red-500' : ''}
            />
            {errors.ocupacion && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.ocupacion.message)}
              </p>
            )}
          </div>

          {/* Educación */}
          <div className="space-y-2">
            <label htmlFor="educacion" className="block text-sm font-medium text-slate-300">
              Nivel educativo <span className="text-red-400">*</span>
            </label>
            <select
              id="educacion"
              {...register('educacion')}
              className={errors.educacion ? 'border-red-500' : ''}
            >
              <option value="">Seleccione...</option>
              {Object.values(NIVELES_EDUCACION).map((nivel) => (
                <option key={nivel} value={nivel}>
                  {getNombreEducacion(nivel as NivelEducacion)}
                </option>
              ))}
            </select>
            {errors.educacion && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.educacion.message)}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado Civil */}
          <div className="space-y-2">
            <label htmlFor="estadoCivil" className="block text-sm font-medium text-slate-300">
              Estado civil <span className="text-red-400">*</span>
            </label>
            <select
              id="estadoCivil"
              {...register('estadoCivil')}
              className={errors.estadoCivil ? 'border-red-500' : ''}
            >
              <option value="">Seleccione...</option>
              {Object.values(ESTADOS_CIVILES).map((estado) => (
                <option key={estado} value={estado}>
                  {getNombreEstadoCivil(estado as EstadoCivil)}
                </option>
              ))}
            </select>
            {errors.estadoCivil && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.estadoCivil.message)}
              </p>
            )}
          </div>

          {/* Género */}
          <div className="space-y-2">
            <label htmlFor="genero" className="block text-sm font-medium text-slate-300">
              Género <span className="text-red-400">*</span>
            </label>
            <select
              id="genero"
              {...register('genero')}
              className={errors.genero ? 'border-red-500' : ''}
            >
              <option value="">Seleccione...</option>
              {Object.values(GENEROS).map((genero) => (
                <option key={genero} value={genero}>
                  {getNombreGenero(genero as Genero)}
                </option>
              ))}
            </select>
            {errors.genero && (
              <p className="text-sm text-red-400" role="alert">
                {String(errors.genero.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <h3 className="font-medium text-blue-300 mb-2">ℹ️ Información importante</h3>
        <ul className="text-sm text-blue-200/80 space-y-1">
          <li>• Asegúrese de que todos los datos sean correctos y estén actualizados</li>
          <li>• El número de cédula será verificado con la Registraduría Nacional</li>
          <li>• El correo electrónico es importante para el envío de notificaciones</li>
          <li>• Debe ser mayor de 18 años para solicitar un crédito</li>
        </ul>
      </div>
    </div>
  )
}
