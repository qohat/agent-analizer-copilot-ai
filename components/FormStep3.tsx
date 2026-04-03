'use client'

import { useFormContext } from 'react-hook-form'

export function FormStep3() {
  const { formState: { errors }, register, watch } = useFormContext<any>()
  const businessSameAddress = watch('businessSameAddress')
  const businessLocationType = watch('businessLocationType')
  const productType = watch('productType')
  const requestedAmount = watch('requestedAmount')
  const loanTermMonths = watch('loanTermMonths')

  // Calculate monthly repayment estimate
  const monthlyRepaymentEstimate = requestedAmount && requestedAmount > 0 && loanTermMonths > 0
    ? Math.round((requestedAmount / loanTermMonths) * 1.25) // Rough estimate with 25% interest
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Información del negocio</h2>
        <p className="text-slate-400 text-sm">Paso 3 de 5</p>
      </div>

      {/* Product Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          Tipo de crédito *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="relative flex items-center p-4 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition"
            style={{ borderColor: productType === 'commercial' ? '#10b981' : undefined }}>
            <input
              type="radio"
              value="commercial"
              {...register('productType')}
              className="w-4 h-4 rounded-full"
            />
            <span className="ml-3 flex-1">
              <span className="font-medium text-slate-300">Comercial</span>
              <p className="text-xs text-slate-400 mt-1">Para negocios, tiendas, servicios</p>
            </span>
          </label>

          <label className="relative flex items-center p-4 border-2 border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition"
            style={{ borderColor: productType === 'agricultural' ? '#10b981' : undefined }}>
            <input
              type="radio"
              value="agricultural"
              {...register('productType')}
              className="w-4 h-4 rounded-full"
            />
            <span className="ml-3 flex-1">
              <span className="font-medium text-slate-300">Agropecuario</span>
              <p className="text-xs text-slate-400 mt-1">Para agricultura, ganadería</p>
            </span>
          </label>
        </div>
        {errors.productType && (
          <p className="text-sm text-red-400">{String(errors.productType.message)}</p>
        )}
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Nombre del negocio/finca *
        </label>
        <input
          type="text"
          placeholder="Tienda Los Andes"
          {...register('businessName')}
          className={errors.businessName ? 'border-red-500' : ''}
        />
        {errors.businessName && (
          <p className="text-sm text-red-400">{String(errors.businessName.message)}</p>
        )}
      </div>

      {/* Business Registration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            NIT/RUT (opcional)
          </label>
          <input
            type="text"
            placeholder="123456789"
            {...register('businessRegistration')}
            className={errors.businessRegistration ? 'border-red-500' : ''}
          />
          {errors.businessRegistration && (
            <p className="text-sm text-red-400">{String(errors.businessRegistration.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Forma jurídica (opcional)
          </label>
          <select
            {...register('businessLegalForm')}
            className={errors.businessLegalForm ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="sole_proprietor">Persona natural</option>
            <option value="cooperative">Cooperativa</option>
            <option value="sas">SAS</option>
            <option value="corporation">Sociedad anónima</option>
          </select>
          {errors.businessLegalForm && (
            <p className="text-sm text-red-400">{String(errors.businessLegalForm.message)}</p>
          )}
        </div>
      </div>

      {/* Business Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Descripción del negocio *
        </label>
        <textarea
          placeholder="Describa brevemente qué hace, productos/servicios, clientes principales..."
          {...register('businessDescription')}
          className={`h-24 resize-none ${errors.businessDescription ? 'border-red-500' : ''}`}
        />
        {errors.businessDescription && (
          <p className="text-sm text-red-400">{String(errors.businessDescription.message)}</p>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 5 - Business Type (CRITICAL) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Tipo de negocio (opcional)
          </label>
          <select
            {...register('businessType')}
            className={errors.businessType ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
          </select>
          {errors.businessType && (
            <p className="text-sm text-red-400">{String(errors.businessType.message)}</p>
          )}
        </div>

        {/* From Excel: Solicitud de Crédito, Section 5 - Business Sector (CRITICAL) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Sector del negocio (opcional)
          </label>
          <input
            type="text"
            placeholder="Comercio, agricultura, manufactura, etc."
            {...register('businessSector')}
            className={errors.businessSector ? 'border-red-500' : ''}
          />
          {errors.businessSector && (
            <p className="text-sm text-red-400">{String(errors.businessSector.message)}</p>
          )}
        </div>
      </div>

      {/* From Excel: Solicitud de Crédito, Section 5 - Business Monthly Sales (CRITICAL) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Ventas mensuales estimadas ($) (opcional)
        </label>
        <input
          type="number"
          placeholder="5000000"
          {...register('businessMonthlySales', { valueAsNumber: true })}
          className={errors.businessMonthlySales ? 'border-red-500' : ''}
        />
        {errors.businessMonthlySales && (
          <p className="text-sm text-red-400">{String(errors.businessMonthlySales.message)}</p>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 1 - Loan Purpose */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Propósito del crédito (opcional)
        </label>
        <input
          type="text"
          placeholder="Capital de trabajo, compra de equipos, expansión, etc."
          {...register('loanPurpose')}
          className={errors.loanPurpose ? 'border-red-500' : ''}
        />
        {errors.loanPurpose && (
          <p className="text-sm text-red-400">{String(errors.loanPurpose.message)}</p>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 5 - Business Same Address */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('businessSameAddress')}
            className="w-4 h-4 rounded border-slate-600"
          />
          <span className="text-sm font-medium text-slate-300">
            ¿La dirección del negocio es la misma de la casa?
          </span>
        </label>
      </div>

      {/* From Excel: Solicitud de Crédito, Section 5 - Business Address (conditional) */}
      {!businessSameAddress && (
        <div className="space-y-6 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <h3 className="font-medium text-slate-300">Dirección diferente del negocio</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Dirección del negocio *
            </label>
            <input
              type="text"
              placeholder="Calle 10 #5-20"
              {...register('businessAddressStreet')}
              className={errors.businessAddressStreet ? 'border-red-500' : ''}
            />
            {errors.businessAddressStreet && (
              <p className="text-sm text-red-400">{String(errors.businessAddressStreet.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Ciudad del negocio *
              </label>
              <input
                type="text"
                placeholder="Neiva"
                {...register('businessAddressCity')}
                className={errors.businessAddressCity ? 'border-red-500' : ''}
              />
              {errors.businessAddressCity && (
                <p className="text-sm text-red-400">{String(errors.businessAddressCity.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Departamento del negocio *
              </label>
              <input
                type="text"
                placeholder="Huila"
                {...register('businessAddressDepartment')}
                className={errors.businessAddressDepartment ? 'border-red-500' : ''}
              />
              {errors.businessAddressDepartment && (
                <p className="text-sm text-red-400">{String(errors.businessAddressDepartment.message)}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Barrio/Vereda (opcional)
            </label>
            <input
              type="text"
              placeholder="Centro"
              {...register('businessAddressNeighborhood')}
              className={errors.businessAddressNeighborhood ? 'border-red-500' : ''}
            />
            {errors.businessAddressNeighborhood && (
              <p className="text-sm text-red-400">{String(errors.businessAddressNeighborhood.message)}</p>
            )}
          </div>
        </div>
      )}

      {/* From Excel: Solicitud de Crédito, Section 5 - Business Location Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Tipo de local del negocio (opcional)
        </label>
        <select
          {...register('businessLocationType')}
          className={errors.businessLocationType ? 'border-red-500' : ''}
        >
          <option value="">Selecciona...</option>
          <option value="propio">Propio</option>
          <option value="arrendado">Arrendado</option>
          <option value="familiar">Familiar</option>
        </select>
        {errors.businessLocationType && (
          <p className="text-sm text-red-400">{String(errors.businessLocationType.message)}</p>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 5 - Business Rent (conditional) */}
      {businessLocationType === 'arrendado' && (
        <div className="space-y-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Nombre del propietario *
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                {...register('businessLandlordName')}
                className={errors.businessLandlordName ? 'border-red-500' : ''}
              />
              {errors.businessLandlordName && (
                <p className="text-sm text-red-400">{String(errors.businessLandlordName.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Monto de arriendo ($) *
              </label>
              <input
                type="number"
                placeholder="500000"
                {...register('businessRentAmount', { valueAsNumber: true })}
                className={errors.businessRentAmount ? 'border-red-500' : ''}
              />
              {errors.businessRentAmount && (
                <p className="text-sm text-red-400">{String(errors.businessRentAmount.message)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business Phone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Teléfono del negocio (opcional)
        </label>
        <input
          type="tel"
          placeholder="+573001234567"
          {...register('businessPhone')}
          className={errors.businessPhone ? 'border-red-500' : ''}
        />
        {errors.businessPhone && (
          <p className="text-sm text-red-400">{String(errors.businessPhone.message)}</p>
        )}
      </div>

      {/* Business Operation */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Meses en operación *
          </label>
          <input
            type="number"
            placeholder="12"
            {...register('businessMonthsInOperation', { valueAsNumber: true })}
            className={errors.businessMonthsInOperation ? 'border-red-500' : ''}
          />
          {errors.businessMonthsInOperation && (
            <p className="text-sm text-red-400">{String(errors.businessMonthsInOperation.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Años en operación (opcional)
          </label>
          <input
            type="number"
            placeholder="2"
            {...register('businessYearsOperating', { valueAsNumber: true })}
            className={errors.businessYearsOperating ? 'border-red-500' : ''}
          />
          {errors.businessYearsOperating && (
            <p className="text-sm text-red-400">{String(errors.businessYearsOperating.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Número de empleados (opcional)
          </label>
          <input
            type="number"
            placeholder="5"
            {...register('businessEmployeesCount', { valueAsNumber: true })}
            className={errors.businessEmployeesCount ? 'border-red-500' : ''}
          />
          {errors.businessEmployeesCount && (
            <p className="text-sm text-red-400">{String(errors.businessEmployeesCount.message)}</p>
          )}
        </div>
      </div>

      {/* Loan Request */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Monto solicitado * (Máximo: $50,000)
          </label>
          <input
            type="number"
            placeholder="5000"
            {...register('requestedAmount', { valueAsNumber: true })}
            className={errors.requestedAmount ? 'border-red-500' : ''}
          />
          {errors.requestedAmount && (
            <p className="text-sm text-red-400">{String(errors.requestedAmount.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Plazo del crédito (meses) *
          </label>
          <select
            {...register('loanTermMonths', { valueAsNumber: true })}
            className={errors.loanTermMonths ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="6">6 meses</option>
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
            <option value="36">36 meses</option>
            <option value="60">60 meses</option>
          </select>
          {errors.loanTermMonths && (
            <p className="text-sm text-red-400">{String(errors.loanTermMonths.message)}</p>
          )}
        </div>
      </div>

      {/* Estimated Monthly Payment */}
      {monthlyRepaymentEstimate > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4">
          <p className="text-sm text-emerald-300">
            <span className="font-medium">Cuota estimada:</span> ${monthlyRepaymentEstimate.toLocaleString('es-CO')}
            <br />
            <span className="text-xs text-emerald-400">(Estimado con 25% interés)</span>
          </p>
        </div>
      )}

      {/* Assets Section */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-slate-300">Activos del negocio (opcional)</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Valor de equipos ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('equipmentValue', { valueAsNumber: true })}
              className={errors.equipmentValue ? 'border-red-500' : ''}
            />
            {errors.equipmentValue && (
              <p className="text-sm text-red-400">{String(errors.equipmentValue.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Efectivo disponible ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('currentCashPosition', { valueAsNumber: true })}
              className={errors.currentCashPosition ? 'border-red-500' : ''}
            />
            {errors.currentCashPosition && (
              <p className="text-sm text-red-400">{String(errors.currentCashPosition.message)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Detalles de propiedad/terreno
          </label>
          <textarea
            placeholder="Descripción de terrenos, edificios, etc."
            {...register('propertyDetails')}
            className={`h-20 resize-none ${errors.propertyDetails ? 'border-red-500' : ''}`}
          />
          {errors.propertyDetails && (
            <p className="text-sm text-red-400">{String(errors.propertyDetails.message)}</p>
          )}
        </div>
      </div>

      {/* Working Capital Section */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 space-y-4">
        <h3 className="font-medium text-slate-300">Capital de trabajo (opcional)</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Días por cobrar
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('accountsReceivableDays', { valueAsNumber: true })}
              className={errors.accountsReceivableDays ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Valor por cobrar ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('accountsReceivableAmount', { valueAsNumber: true })}
              className={errors.accountsReceivableAmount ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Días de inventario
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('inventoryDays', { valueAsNumber: true })}
              className={errors.inventoryDays ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Tipo de inventario
            </label>
            <input
              type="text"
              placeholder="Productos, materiales..."
              {...register('inventoryType')}
              className={errors.inventoryType ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Valor de inventario ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('inventoryValue', { valueAsNumber: true })}
              className={errors.inventoryValue ? 'border-red-500' : ''}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Días por pagar
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('accountsPayableDays', { valueAsNumber: true })}
              className={errors.accountsPayableDays ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Valor por pagar ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('accountsPayableAmount', { valueAsNumber: true })}
              className={errors.accountsPayableAmount ? 'border-red-500' : ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
