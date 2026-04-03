'use client'

import { useFormContext } from 'react-hook-form'
import { Trash2, Plus } from 'lucide-react'

export function FormStep6() {
  const { formState: { errors }, register, watch, setValue } = useFormContext<any>()

  const realEstateCount = watch('realEstateCount') || 0
  const vehiclesCount = watch('vehiclesCount') || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Bienes y Referencias</h2>
        <p className="text-slate-400 text-sm">Paso 6 de 11</p>
      </div>

      {/* REAL ESTATE SECTION */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-300">Bienes Raíces</h3>
          <button
            type="button"
            onClick={() => {
              if (realEstateCount < 3) {
                setValue('realEstateCount', realEstateCount + 1)
              }
            }}
            disabled={realEstateCount >= 3}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {/* Real Estate 1 */}
        {realEstateCount >= 1 && (
          <div className="space-y-4 p-3 bg-slate-900/50 rounded border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-emerald-300">Propiedad 1</h4>
              <button
                type="button"
                onClick={() => setValue('realEstateCount', realEstateCount - 1)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Descripción (ej: Casa residencial)"
                {...register('realEstate1Description')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />

              <input
                type="text"
                placeholder="Ubicación"
                {...register('realEstate1Location')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Valor estimado ($)"
                  {...register('realEstate1EstimatedValue', { valueAsNumber: true })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Deuda ($)"
                  {...register('realEstate1DebtValue', { valueAsNumber: true })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="% Propiedad"
                  {...register('realEstate1OwnershipPercent', { valueAsNumber: true })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Real Estate 2 */}
        {realEstateCount >= 2 && (
          <div className="space-y-4 p-3 bg-slate-900/50 rounded border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-emerald-300">Propiedad 2</h4>
              <button
                type="button"
                onClick={() => setValue('realEstateCount', realEstateCount - 1)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Descripción"
                {...register('realEstate2Description')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />

              <input
                type="text"
                placeholder="Ubicación"
                {...register('realEstate2Location')}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Valor estimado ($)"
                  {...register('realEstate2EstimatedValue', { valueAsNumber: true })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="Deuda ($)"
                  {...register('realEstate2DebtValue', { valueAsNumber: true })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                />
                <input
                  type="number"
                  placeholder="% Propiedad"
                  {...register('realEstate2OwnershipPercent', { valueAsNumber: true })}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* VEHICLES SECTION */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-300">Vehículos</h3>
          <button
            type="button"
            onClick={() => {
              if (vehiclesCount < 2) {
                setValue('vehiclesCount', vehiclesCount + 1)
              }
            }}
            disabled={vehiclesCount >= 2}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {/* Vehicle 1 */}
        {vehiclesCount >= 1 && (
          <div className="space-y-4 p-3 bg-slate-900/50 rounded border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-emerald-300">Vehículo 1</h4>
              <button
                type="button"
                onClick={() => setValue('vehiclesCount', vehiclesCount - 1)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tipo (ej: Automóvil)"
                {...register('vehicle1Type')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Año"
                {...register('vehicle1Year', { valueAsNumber: true })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Marca"
                {...register('vehicle1Make')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Modelo"
                {...register('vehicle1Model')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Valor ($)"
                {...register('vehicle1Value', { valueAsNumber: true })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Deuda ($)"
                {...register('vehicle1DebtValue', { valueAsNumber: true })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
            </div>
          </div>
        )}

        {/* Vehicle 2 */}
        {vehiclesCount >= 2 && (
          <div className="space-y-4 p-3 bg-slate-900/50 rounded border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-emerald-300">Vehículo 2</h4>
              <button
                type="button"
                onClick={() => setValue('vehiclesCount', vehiclesCount - 1)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tipo (ej: Automóvil)"
                {...register('vehicle2Type')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Año"
                {...register('vehicle2Year', { valueAsNumber: true })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Marca"
                {...register('vehicle2Make')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="text"
                placeholder="Modelo"
                {...register('vehicle2Model')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Valor ($)"
                {...register('vehicle2Value', { valueAsNumber: true })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
              <input
                type="number"
                placeholder="Deuda ($)"
                {...register('vehicle2DebtValue', { valueAsNumber: true })}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* REFERENCES SECTION */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300">Referencias personales</h3>
        <p className="text-xs text-slate-400">Proporciona 3 referencias (personas que te conocen)</p>

        {/* Reference 1 */}
        <div className="space-y-3 p-3 bg-slate-900/50 rounded border border-slate-700">
          <h4 className="text-sm font-semibold text-emerald-300">Referencia 1</h4>
          <input
            type="text"
            placeholder="Nombre completo"
            {...register('reference1Name')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
          <input
            type="text"
            placeholder="Relación (ej: Amigo, Vecino)"
            {...register('reference1Relationship')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            {...register('reference1Phone')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
        </div>

        {/* Reference 2 */}
        <div className="space-y-3 p-3 bg-slate-900/50 rounded border border-slate-700">
          <h4 className="text-sm font-semibold text-emerald-300">Referencia 2</h4>
          <input
            type="text"
            placeholder="Nombre completo"
            {...register('reference2Name')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
          <input
            type="text"
            placeholder="Relación (ej: Amigo, Vecino)"
            {...register('reference2Relationship')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            {...register('reference2Phone')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
        </div>

        {/* Reference 3 */}
        <div className="space-y-3 p-3 bg-slate-900/50 rounded border border-slate-700">
          <h4 className="text-sm font-semibold text-emerald-300">Referencia 3</h4>
          <input
            type="text"
            placeholder="Nombre completo"
            {...register('reference3Name')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
          <input
            type="text"
            placeholder="Relación (ej: Amigo, Vecino)"
            {...register('reference3Relationship')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            {...register('reference3Phone')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
          />
        </div>
      </div>
    </div>
  )
}
