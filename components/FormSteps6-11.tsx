/**
 * FormSteps 6-11: Componentes compactos
 */

'use client'

import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Users, Package, Calculator, TrendingUp, Wallet, CheckCircle, Plus, Trash2, Home, Car } from 'lucide-react'

// Step 6: Cónyuge
export function FormStep6New() {
  const { register, formState: { errors } } = useFormContext()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-7 h-7 text-emerald-400" />
          Datos del Cónyuge
        </h2>
        <p className="text-slate-400">Complete solo si está casado o en unión libre.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg">
          <input id="conyugeFirma" type="checkbox" {...register('conyugeFirma')} className="w-4 h-4" />
          <label htmlFor="conyugeFirma" className="font-medium">El cónyuge firma como codeudor</label>
        </div>

        {/* Documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugeTipoDocumento" className="block text-sm font-medium mb-1">Tipo de documento</label>
            <select id="conyugeTipoDocumento" {...register('tipoDocumento')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white">
              <option value="">Seleccione...</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>
          <div>
            <label htmlFor="conyugeIdentificacion" className="block text-sm font-medium mb-1">Número de identificación</label>
            <input id="conyugeIdentificacion" {...register('identificacion')} placeholder="12345678" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
        </div>

        {/* Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugePrimerNombre" className="block text-sm font-medium mb-1">Primer nombre</label>
            <input id="conyugePrimerNombre" {...register('primerNombre')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="conyugeSegundoNombre" className="block text-sm font-medium mb-1">Segundo nombre (opcional)</label>
            <input id="conyugeSegundoNombre" {...register('segundoNombre')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
        </div>

        {/* Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugePrimerApellido" className="block text-sm font-medium mb-1">Primer apellido</label>
            <input id="conyugePrimerApellido" {...register('primerApellido')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="conyugeSegundoApellido" className="block text-sm font-medium mb-1">Segundo apellido (opcional)</label>
            <input id="conyugeSegundoApellido" {...register('segundoApellido')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
        </div>

        {/* Fecha nacimiento y género */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugeFechaNacimiento" className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
            <input id="conyugeFechaNacimiento" type="date" {...register('fechaNacimiento')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="conyugeGenero" className="block text-sm font-medium mb-1">Género</label>
            <select id="conyugeGenero" {...register('genero')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white">
              <option value="">Seleccione...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Ocupación y Nacionalidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugeOcupacion" className="block text-sm font-medium mb-1">Ocupación</label>
            <input id="conyugeOcupacion" {...register('ocupacion')} placeholder="Ej: Comerciante" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="conyugeNacionalidad" className="block text-sm font-medium mb-1">Nacionalidad</label>
            <input id="conyugeNacionalidad" {...register('nacionalidad')} placeholder="Ej: Colombiana" defaultValue="Colombiana" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
        </div>

        {/* Teléfonos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugeCelular" className="block text-sm font-medium mb-1">Celular</label>
            <input id="conyugeCelular" type="tel" {...register('celular')} placeholder="3001234567" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="conyugeTelefonoFijo" className="block text-sm font-medium mb-1">Teléfono fijo (opcional)</label>
            <input id="conyugeTelefonoFijo" type="tel" {...register('telefonoFijo')} placeholder="6012345678" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
        </div>

        {/* Expedición documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="conyugeFechaExpedicion" className="block text-sm font-medium mb-1">Fecha de expedición</label>
            <input id="conyugeFechaExpedicion" type="date" {...register('fechaExpedicion')} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="conyugeLugarExpedicion" className="block text-sm font-medium mb-1">Lugar de expedición</label>
            <input id="conyugeLugarExpedicion" {...register('lugarExpedicion')} placeholder="Ej: Bogotá D.C." className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 7: Bienes y Referencias
export function FormStep7New() {
  const { register, control, formState: { errors } } = useFormContext()
  const { fields: bienesFields, append: appendBien, remove: removeBien } = useFieldArray({
    control,
    name: 'bienesRaices',
  })
  const { fields: vehiculosFields, append: appendVehiculo, remove: removeVehiculo } = useFieldArray({
    control,
    name: 'vehiculos',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Package className="w-7 h-7 text-emerald-400" />
          Bienes y Referencias
        </h2>
        <p className="text-slate-400">Información sobre sus bienes y referencias personales.</p>
      </div>

      {/* Error general del formulario */}
      {errors.root && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-sm text-red-400" role="alert">
            {String(errors.root.message || 'Error de validación')}
          </p>
        </div>
      )}

      {/* Bienes Raíces */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-400" />
            Bienes Raíces (máximo 3)
          </h3>
          <button
            type="button"
            onClick={() => appendBien({ tipoInmueble: 'casa', avaluoComercial: 0 })}
            disabled={bienesFields.length >= 3}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm flex items-center gap-1 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Agregar bien
          </button>
        </div>

        {bienesFields.length === 0 && (
          <p className="text-slate-500 text-sm italic">No hay bienes raíces agregados (opcional)</p>
        )}

        {bienesFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-slate-700/50 rounded-lg space-y-3 border border-slate-600">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Bien #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeBien(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de inmueble</label>
                <select {...register(`bienesRaices.${index}.tipoInmueble`)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white">
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="lote">Lote</option>
                  <option value="finca">Finca</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avalúo comercial ($)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  {...register(`bienesRaices.${index}.avaluoComercial`, {
                    setValueAs: (v) => {
                      const cleaned = String(v || '').replace(/[^0-9]/g, '')
                      return cleaned === '' ? 0 : parseInt(cleaned, 10)
                    },
                  })}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement
                    input.value = input.value.replace(/[^0-9]/g, '')
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Matrícula inmobiliaria</label>
                <input {...register(`bienesRaices.${index}.numeroDocumento`)} placeholder="Opcional" className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input {...register(`bienesRaices.${index}.ciudad`)} placeholder="Ej: Bogotá" className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha documento</label>
                <input type="date" {...register(`bienesRaices.${index}.fechaDocumento`)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehículos */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Car className="w-5 h-5 text-purple-400" />
            Vehículos (máximo 2)
          </h3>
          <button
            type="button"
            onClick={() => appendVehiculo({ clase: 'auto', modelo: 2020, valorComercial: 0 })}
            disabled={vehiculosFields.length >= 2}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm flex items-center gap-1 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Agregar vehículo
          </button>
        </div>

        {vehiculosFields.length === 0 && (
          <p className="text-slate-500 text-sm italic">No hay vehículos agregados (opcional)</p>
        )}

        {vehiculosFields.map((field, index) => (
          <div key={field.id} className="p-4 bg-slate-700/50 rounded-lg space-y-3 border border-slate-600">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Vehículo #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeVehiculo(index)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Clase</label>
                <select {...register(`vehiculos.${index}.clase`)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white">
                  <option value="auto">Automóvil</option>
                  <option value="moto">Motocicleta</option>
                  <option value="camion">Camión</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modelo (año)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  {...register(`vehiculos.${index}.modelo`, {
                    setValueAs: (v) => {
                      const cleaned = String(v || '').replace(/[^0-9]/g, '')
                      return cleaned === '' ? 0 : parseInt(cleaned, 10)
                    },
                  })}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement
                    input.value = input.value.replace(/[^0-9]/g, '')
                  }}
                  placeholder="2020"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Placa</label>
                <input {...register(`vehiculos.${index}.placa`)} placeholder="ABC123" className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white uppercase" maxLength={6} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor comercial ($)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  {...register(`vehiculos.${index}.valorComercial`, {
                    setValueAs: (v) => {
                      const cleaned = String(v || '').replace(/[^0-9]/g, '')
                      return cleaned === '' ? 0 : parseInt(cleaned, 10)
                    },
                  })}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement
                    input.value = input.value.replace(/[^0-9]/g, '')
                  }}
                  placeholder="0"
                  className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Referencias Personales */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Referencias Personales
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Proporcione al menos <span className="text-emerald-400 font-semibold">2 referencias completas</span> (puede completar las 3 si lo desea)
          </p>
        </div>

        {['familiar', 'comercial', 'personal'].map((tipo) => (
          <div key={tipo} className="space-y-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h4 className="font-medium capitalize text-emerald-300">{tipo}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs mb-1">Nombre completo</label>
                <input placeholder="Nombre completo" {...register(`referencias.${tipo}.nombre`)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs mb-1">Teléfono</label>
                <input placeholder="Teléfono" {...register(`referencias.${tipo}.telefono`)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs mb-1">Dirección</label>
                <input placeholder="Dirección" {...register(`referencias.${tipo}.direccion`)} className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Step 8: Balance General
export function FormStep8New() {
  const { register, watch, setValue } = useFormContext()

  // Watch all balance fields for calculations
  const activos = watch('activos') || {}
  const pasivos = watch('pasivos') || {}

  // Helper to sum negocio + familiar
  const sumMontos = (obj: any) => {
    if (!obj) return 0
    return (obj.negocio || 0) + (obj.familiar || 0)
  }

  // Calculate totals
  const activosCorrientes = activos.corrientes || {}
  const activosFijos = activos.fijos || {}
  const pasivosCorrientes = pasivos.corriente || {}
  const pasivosLargoPlazo = pasivos.largoPlazo || {}

  const totalActivosCorrientes =
    sumMontos(activosCorrientes.caja) +
    sumMontos(activosCorrientes.bancosAhorrosCDT) +
    sumMontos(activosCorrientes.cuentasPorCobrar) +
    sumMontos(activosCorrientes.inventarios)

  const totalActivosFijos =
    sumMontos(activosFijos.maquinariaEquipo) +
    sumMontos(activosFijos.edificiosTerrenos) +
    sumMontos(activosFijos.vehiculos) +
    sumMontos(activosFijos.semovientes) +
    sumMontos(activosFijos.otrosActivos)

  const totalActivos = totalActivosCorrientes + totalActivosFijos

  const totalPasivoCorriente =
    sumMontos(pasivosCorrientes.proveedores) +
    sumMontos(pasivosCorrientes.obligacionesCortoPlazo)

  const totalPasivoLargoPlazo = sumMontos(pasivosLargoPlazo.obligacionesLargoPlazo)

  const totalPasivos = totalPasivoCorriente + totalPasivoLargoPlazo
  const patrimonio = totalActivos - totalPasivos

  // Update calculated fields
  React.useEffect(() => {
    setValue('calculated.totalActivosCorrientes', totalActivosCorrientes)
    setValue('calculated.totalActivosFijos', totalActivosFijos)
    setValue('calculated.totalActivos', totalActivos)
    setValue('calculated.totalPasivoCorriente', totalPasivoCorriente)
    setValue('calculated.totalPasivoLargoPlazo', totalPasivoLargoPlazo)
    setValue('calculated.totalPasivos', totalPasivos)
    setValue('calculated.patrimonio', patrimonio)
  }, [totalActivosCorrientes, totalActivosFijos, totalActivos, totalPasivoCorriente, totalPasivoLargoPlazo, totalPasivos, patrimonio, setValue])

  const MoneyInput = ({ name, label }: { name: string; label: string }) => (
    <div>
      <label className="block text-xs mb-1">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        {...register(name, {
          setValueAs: (v) => {
            const cleaned = String(v || '').replace(/[^0-9]/g, '')
            return cleaned === '' ? 0 : parseInt(cleaned, 10)
          },
        })}
        onInput={(e) => {
          const input = e.target as HTMLInputElement
          input.value = input.value.replace(/[^0-9]/g, '')
        }}
        placeholder="0"
        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm text-right"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Calculator className="w-7 h-7 text-emerald-400" />
          Balance General
        </h2>
        <p className="text-slate-400">Activos y pasivos del negocio y familiares (valores en pesos).</p>
      </div>

      {/* ACTIVOS CORRIENTES */}
      <div className="space-y-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
        <h3 className="text-lg font-semibold text-blue-300">Activos Corrientes</h3>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Caja</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.corrientes.caja.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.corrientes.caja.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Bancos, Ahorros y CDT</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.corrientes.bancosAhorrosCDT.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.corrientes.bancosAhorrosCDT.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Cuentas por Cobrar</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.corrientes.cuentasPorCobrar.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.corrientes.cuentasPorCobrar.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Inventarios</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.corrientes.inventarios.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.corrientes.inventarios.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="pt-3 border-t border-blue-500/30 flex justify-between items-center">
          <span className="font-semibold">Total Activos Corrientes:</span>
          <span className="text-xl font-bold text-blue-300">${totalActivosCorrientes.toLocaleString()}</span>
        </div>
      </div>

      {/* ACTIVOS FIJOS */}
      <div className="space-y-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300">Activos Fijos</h3>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Maquinaria y Equipo</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.fijos.maquinariaEquipo.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.fijos.maquinariaEquipo.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Edificios y Terrenos</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.fijos.edificiosTerrenos.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.fijos.edificiosTerrenos.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Vehículos</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.fijos.vehiculos.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.fijos.vehiculos.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Semovientes (ganado, animales)</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.fijos.semovientes.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.fijos.semovientes.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Otros Activos</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="activos.fijos.otrosActivos.negocio" label="Negocio ($)" />
            <MoneyInput name="activos.fijos.otrosActivos.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="pt-3 border-t border-purple-500/30 flex justify-between items-center">
          <span className="font-semibold">Total Activos Fijos:</span>
          <span className="text-xl font-bold text-purple-300">${totalActivosFijos.toLocaleString()}</span>
        </div>
      </div>

      {/* PASIVOS CORRIENTES */}
      <div className="space-y-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
        <h3 className="text-lg font-semibold text-orange-300">Pasivos Corrientes</h3>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Proveedores</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="pasivos.corriente.proveedores.negocio" label="Negocio ($)" />
            <MoneyInput name="pasivos.corriente.proveedores.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Obligaciones a Corto Plazo</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="pasivos.corriente.obligacionesCortoPlazo.negocio" label="Negocio ($)" />
            <MoneyInput name="pasivos.corriente.obligacionesCortoPlazo.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="pt-3 border-t border-orange-500/30 flex justify-between items-center">
          <span className="font-semibold">Total Pasivo Corriente:</span>
          <span className="text-xl font-bold text-orange-300">${totalPasivoCorriente.toLocaleString()}</span>
        </div>
      </div>

      {/* PASIVOS LARGO PLAZO */}
      <div className="space-y-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300">Pasivos a Largo Plazo</h3>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Obligaciones a Largo Plazo</h4>
          <div className="grid grid-cols-2 gap-3">
            <MoneyInput name="pasivos.largoPlazo.obligacionesLargoPlazo.negocio" label="Negocio ($)" />
            <MoneyInput name="pasivos.largoPlazo.obligacionesLargoPlazo.familiar" label="Familiar ($)" />
          </div>
        </div>

        <div className="pt-3 border-t border-red-500/30 flex justify-between items-center">
          <span className="font-semibold">Total Pasivo Largo Plazo:</span>
          <span className="text-xl font-bold text-red-300">${totalPasivoLargoPlazo.toLocaleString()}</span>
        </div>
      </div>

      {/* RESUMEN */}
      <div className="space-y-3 p-6 bg-emerald-500/20 rounded-lg border-2 border-emerald-500/50">
        <h3 className="text-xl font-bold text-emerald-300">Resumen del Balance</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total Activos:</span>
            <span className="font-bold">${totalActivos.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Pasivos:</span>
            <span className="font-bold">${totalPasivos.toLocaleString()}</span>
          </div>
          <div className="pt-2 border-t-2 border-emerald-500/50 flex justify-between items-center">
            <span className="text-lg font-semibold">Patrimonio Neto:</span>
            <span className={`text-2xl font-bold ${patrimonio >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>
              ${patrimonio.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 9: Ingresos y Gastos
export function FormStep9New() {
  const { register, watch, setValue } = useFormContext()

  // Watch all income and expense fields
  const ingresosMensualesTitular = watch('ingresos.ingresosMensualesTitular') || 0
  const otrosIngresosTitular = watch('ingresos.otrosIngresosTitular') || 0
  const ingresosConyuge = watch('ingresos.ingresosConyuge') || 0
  const otrosIngresosConyuge = watch('ingresos.otrosIngresosConyuge') || 0

  const alimentacion = watch('gastos.alimentacion') || 0
  const arrendamiento = watch('gastos.arrendamiento') || 0
  const serviciosPublicos = watch('gastos.serviciosPublicos') || 0
  const educacion = watch('gastos.educacion') || 0
  const transporte = watch('gastos.transporte') || 0
  const salud = watch('gastos.salud') || 0
  const otros = watch('gastos.otros') || 0

  // Calculate totals
  const totalIngresosTitular = ingresosMensualesTitular + otrosIngresosTitular
  const totalIngresosConyuge = ingresosConyuge + otrosIngresosConyuge
  const totalIngresosFamiliares = totalIngresosTitular + totalIngresosConyuge
  const totalGastosFamiliares = alimentacion + arrendamiento + serviciosPublicos + educacion + transporte + salud + otros

  // Update calculated fields
  React.useEffect(() => {
    setValue('calculated.totalIngresosTitular', totalIngresosTitular)
    setValue('calculated.totalIngresosConyuge', totalIngresosConyuge)
    setValue('calculated.totalIngresosFamiliares', totalIngresosFamiliares)
    setValue('calculated.totalGastosFamiliares', totalGastosFamiliares)
  }, [totalIngresosTitular, totalIngresosConyuge, totalIngresosFamiliares, totalGastosFamiliares, setValue])

  const MoneyInput = ({ name, label, required = false }: { name: string; label: string; required?: boolean }) => (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        inputMode="numeric"
        {...register(name, {
          setValueAs: (v) => {
            const cleaned = String(v || '').replace(/[^0-9]/g, '')
            return cleaned === '' ? 0 : parseInt(cleaned, 10)
          },
        })}
        onInput={(e) => {
          const input = e.target as HTMLInputElement
          input.value = input.value.replace(/[^0-9]/g, '')
        }}
        placeholder="0"
        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-right"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-emerald-400" />
          Ingresos y Gastos Mensuales
        </h2>
        <p className="text-slate-400">Flujo de dinero mensual del hogar (valores en pesos).</p>
      </div>

      {/* INGRESOS */}
      <div className="space-y-4 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
        <h3 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Ingresos
        </h3>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Titular</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MoneyInput name="ingresos.ingresosMensualesTitular" label="Ingresos mensuales" required />
            <MoneyInput name="ingresos.otrosIngresosTitular" label="Otros ingresos" />
          </div>
          <div className="text-right text-sm">
            <span className="text-slate-400">Subtotal titular:</span>{' '}
            <span className="font-bold text-emerald-300">${totalIngresosTitular.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Cónyuge (si aplica)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MoneyInput name="ingresos.ingresosConyuge" label="Ingresos mensuales cónyuge" />
            <MoneyInput name="ingresos.otrosIngresosConyuge" label="Otros ingresos cónyuge" />
          </div>
          <div className="text-right text-sm">
            <span className="text-slate-400">Subtotal cónyuge:</span>{' '}
            <span className="font-bold text-emerald-300">${totalIngresosConyuge.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-emerald-500/30 flex justify-between items-center">
          <span className="font-semibold text-lg">Total Ingresos Familiares:</span>
          <span className="text-2xl font-bold text-emerald-300">${totalIngresosFamiliares.toLocaleString()}</span>
        </div>
      </div>

      {/* GASTOS */}
      <div className="space-y-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
        <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Gastos
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MoneyInput name="gastos.alimentacion" label="Alimentación" required />
          <MoneyInput name="gastos.arrendamiento" label="Arrendamiento" />
          <MoneyInput name="gastos.serviciosPublicos" label="Servicios públicos" required />
          <MoneyInput name="gastos.educacion" label="Educación" />
          <MoneyInput name="gastos.transporte" label="Transporte" required />
          <MoneyInput name="gastos.salud" label="Salud" required />
          <MoneyInput name="gastos.otros" label="Otros gastos" />
        </div>

        <div className="pt-3 border-t border-red-500/30 flex justify-between items-center">
          <span className="font-semibold text-lg">Total Gastos Familiares:</span>
          <span className="text-2xl font-bold text-red-300">${totalGastosFamiliares.toLocaleString()}</span>
        </div>
      </div>

      {/* RESUMEN */}
      {totalIngresosFamiliares > 0 && (
        <div className="space-y-3 p-6 bg-blue-500/20 rounded-lg border-2 border-blue-500/50">
          <h3 className="text-xl font-bold text-blue-300">Resumen Mensual</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Ingresos:</span>
              <span className="font-bold text-emerald-300">${totalIngresosFamiliares.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Gastos:</span>
              <span className="font-bold text-red-300">${totalGastosFamiliares.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t-2 border-blue-500/50 flex justify-between items-center">
              <span className="text-lg font-semibold">Excedente Mensual:</span>
              <span className={`text-2xl font-bold ${
                (totalIngresosFamiliares - totalGastosFamiliares) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                ${(totalIngresosFamiliares - totalGastosFamiliares).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Step 10: Capacidad de Pago
export function FormStep10New() {
  const { register, watch, setValue } = useFormContext()

  // Watch necessary fields
  const obligacionesFinancieras = watch('obligacionesFinancieras') || 0

  // Get data from Step 1 (loan request)
  const valorSolicitado = watch('valorSolicitado') || 0
  const numeroCuotas = watch('numeroCuotas') || 1

  // Get calculated totals from Step 9
  const totalIngresosFamiliares = watch('calculated.totalIngresosFamiliares') || 0
  const totalGastosFamiliares = watch('calculated.totalGastosFamiliares') || 0

  // Calculate cuota solicitada (using 2% monthly interest rate - typical for microcredit)
  const tasaMensual = 0.02
  const cuotaSolicitada = valorSolicitado > 0 && numeroCuotas > 0
    ? (valorSolicitado * (tasaMensual * Math.pow(1 + tasaMensual, numeroCuotas))) / (Math.pow(1 + tasaMensual, numeroCuotas) - 1)
    : 0

  // Calculate metrics
  const utilidadMensual = totalIngresosFamiliares - totalGastosFamiliares
  const capacidadPago = utilidadMensual - obligacionesFinancieras
  const ratioDeudaIngreso = totalIngresosFamiliares > 0
    ? ((obligacionesFinancieras + cuotaSolicitada) / totalIngresosFamiliares) * 100
    : 0

  // Determine alerts
  const capacidadInsuficiente = capacidadPago < cuotaSolicitada
  const ratioAlto = ratioDeudaIngreso > 50

  // Update calculated fields
  React.useEffect(() => {
    setValue('utilidadMensual', utilidadMensual)
    setValue('capacidadPago', capacidadPago)
    setValue('ratioDeudaIngreso', ratioDeudaIngreso)
    setValue('cuotaSolicitada', cuotaSolicitada)
    setValue('alertas.capacidadInsuficiente', capacidadInsuficiente)
    setValue('alertas.ratioAlto', ratioAlto)
  }, [utilidadMensual, capacidadPago, ratioDeudaIngreso, cuotaSolicitada, capacidadInsuficiente, ratioAlto, setValue])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Calculator className="w-7 h-7 text-emerald-400" />
          Capacidad de Pago
        </h2>
        <p className="text-slate-400">Análisis de su capacidad para asumir el crédito solicitado.</p>
      </div>

      {/* Input manual */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div>
          <label htmlFor="obligacionesFinancieras" className="block text-sm font-medium mb-1">
            Obligaciones financieras actuales (mensual) <span className="text-slate-400">($)</span>
          </label>
          <input
            id="obligacionesFinancieras"
            type="text"
            inputMode="numeric"
            {...register('obligacionesFinancieras', {
              setValueAs: (v) => {
                const cleaned = String(v || '').replace(/[^0-9]/g, '')
                return cleaned === '' ? 0 : parseInt(cleaned, 10)
              },
            })}
            onInput={(e) => {
              const input = e.target as HTMLInputElement
              input.value = input.value.replace(/[^0-9]/g, '')
            }}
            placeholder="0"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-right"
          />
          <p className="text-xs text-slate-400 mt-1">
            Suma de todas las cuotas de créditos actuales (tarjetas, préstamos, etc.)
          </p>
        </div>
      </div>

      {/* Metrics cards */}
      {totalIngresosFamiliares > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Utilidad Mensual */}
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Utilidad Mensual</h3>
            <p className="text-xs text-slate-400 mb-1">Ingresos - Gastos</p>
            <p className="text-2xl font-bold text-blue-300">${utilidadMensual.toLocaleString()}</p>
          </div>

          {/* Cuota Solicitada */}
          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <h3 className="text-sm font-medium text-purple-300 mb-2">Cuota Solicitada</h3>
            <p className="text-xs text-slate-400 mb-1">
              ${valorSolicitado.toLocaleString()} en {numeroCuotas} cuotas (2% mensual)
            </p>
            <p className="text-2xl font-bold text-purple-300">${Math.round(cuotaSolicitada).toLocaleString()}</p>
          </div>

          {/* Capacidad de Pago */}
          <div className={`p-4 rounded-lg border-2 ${
            capacidadInsuficiente
              ? 'bg-red-500/20 border-red-500/50'
              : 'bg-emerald-500/20 border-emerald-500/50'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${
              capacidadInsuficiente ? 'text-red-300' : 'text-emerald-300'
            }`}>
              Capacidad de Pago
            </h3>
            <p className="text-xs text-slate-400 mb-1">Utilidad - Obligaciones actuales</p>
            <p className={`text-2xl font-bold ${
              capacidadInsuficiente ? 'text-red-300' : 'text-emerald-300'
            }`}>
              ${capacidadPago.toLocaleString()}
            </p>
          </div>

          {/* Ratio Deuda/Ingreso */}
          <div className={`p-4 rounded-lg border-2 ${
            ratioAlto
              ? 'bg-orange-500/20 border-orange-500/50'
              : 'bg-green-500/20 border-green-500/50'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${
              ratioAlto ? 'text-orange-300' : 'text-green-300'
            }`}>
              Ratio Deuda/Ingreso
            </h3>
            <p className="text-xs text-slate-400 mb-1">
              (Obligaciones + Cuota nueva) / Ingresos
            </p>
            <p className={`text-2xl font-bold ${
              ratioAlto ? 'text-orange-300' : 'text-green-300'
            }`}>
              {ratioDeudaIngreso.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      {/* Alertas */}
      {totalIngresosFamiliares > 0 && (capacidadInsuficiente || ratioAlto) && (
        <div className="space-y-3">
          {capacidadInsuficiente && (
            <div className="p-4 bg-red-500/20 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-red-400 text-2xl">⚠️</div>
                <div>
                  <h4 className="font-bold text-red-300 mb-1">Capacidad Insuficiente</h4>
                  <p className="text-sm text-slate-300">
                    Su capacidad de pago (${capacidadPago.toLocaleString()}) es menor que la cuota solicitada
                    (${Math.round(cuotaSolicitada).toLocaleString()}). Es posible que el crédito no sea aprobado
                    o necesite ajustar el monto o el plazo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {ratioAlto && (
            <div className="p-4 bg-orange-500/20 border-l-4 border-orange-500 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="text-orange-400 text-2xl">⚠️</div>
                <div>
                  <h4 className="font-bold text-orange-300 mb-1">Ratio de Endeudamiento Alto</h4>
                  <p className="text-sm text-slate-300">
                    Su ratio de deuda/ingreso ({ratioDeudaIngreso.toFixed(1)}%) supera el 50% recomendado.
                    Esto indica un alto nivel de endeudamiento y puede afectar la aprobación del crédito.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status positivo */}
      {totalIngresosFamiliares > 0 && !capacidadInsuficiente && !ratioAlto && (
        <div className="p-4 bg-emerald-500/20 border-l-4 border-emerald-500 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-emerald-400 text-2xl">✅</div>
            <div>
              <h4 className="font-bold text-emerald-300 mb-1">Capacidad de Pago Saludable</h4>
              <p className="text-sm text-slate-300">
                Su capacidad de pago es suficiente para cubrir la cuota solicitada y su ratio de
                endeudamiento está en un nivel saludable. El crédito tiene buenas probabilidades de aprobación.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info note */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <h3 className="font-medium text-blue-300 mb-2">ℹ️ Nota sobre los cálculos</h3>
        <ul className="text-sm text-blue-200/80 space-y-1 list-disc list-inside">
          <li>La cuota solicitada se calcula con una tasa estimada del 2% mensual</li>
          <li>Un ratio deuda/ingreso superior al 50% se considera riesgoso</li>
          <li>La decisión final dependerá del análisis completo del comité de crédito</li>
        </ul>
      </div>
    </div>
  )
}

// Step 11: Resumen
export function FormStep11New() {
  const { register, formState: { errors }, watch } = useFormContext()

  const confirmacion = watch('confirmacion')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Resumen y Envío</h2>
        <p className="text-slate-400">Revise la información antes de enviar.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            Solicitud completa
          </h3>
          <p className="text-slate-300 mb-4">
            Ha completado todos los pasos del formulario. Revise que la información sea correcta antes de enviar.
          </p>

          <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
            <input
              id="confirmacion"
              type="checkbox"
              {...register('confirmacion')}
              className="mt-1"
            />
            <label htmlFor="confirmacion" className="text-sm">
              <strong>Confirmo que:</strong> Toda la información proporcionada es verdadera y completa.
              Autorizo la verificación de mis datos y acepto los términos y condiciones.
            </label>
          </div>

          {errors.confirmacion && (
            <p className="text-sm text-red-400 mt-2" role="alert">
              {String(errors.confirmacion.message)}
            </p>
          )}
        </div>

        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
          <h4 className="font-medium text-blue-300 mb-2">Próximos pasos</h4>
          <ol className="text-sm text-blue-200/80 space-y-1 list-decimal list-inside">
            <li>Su solicitud será revisada por un asesor</li>
            <li>Recibirá notificación por correo/SMS del estado</li>
            <li>Si es aprobada, se coordinarán los siguientes pasos</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
