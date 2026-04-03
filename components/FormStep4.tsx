'use client'

import { useFormContext } from 'react-hook-form'
import { useMemo } from 'react'

export function FormStep4() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  const primaryIncomeMonthly = watch('primaryIncomeMonthly') || 0
  const secondaryIncomeMonthly = watch('secondaryIncomeMonthly') || 0
  const spouseIncomeMonthly = watch('spouseIncomeMonthly') || 0
  const householdExpenses = watch('householdExpensesMonthly') || 0
  const businessExpenses = watch('businessExpensesMonthly') || 0
  const debtObligations = watch('debtObligationsMonthly') || 0
  const productType = watch('productType')

  // Calculate totals
  const totalIncome = (primaryIncomeMonthly || 0) + (secondaryIncomeMonthly || 0) + (spouseIncomeMonthly || 0)
  const totalExpenses = (householdExpenses || 0) + (businessExpenses || 0) + (debtObligations || 0)
  const netIncome = totalIncome - totalExpenses

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Ingresos y egresos</h2>
        <p className="text-slate-400 text-sm">Paso 4 de 5</p>
      </div>

      {/* Primary Income */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-emerald-400">Ingreso principal</h3>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Fuente de ingreso *
          </label>
          <select
            {...register('primaryIncomeSource')}
            className={errors.primaryIncomeSource ? 'border-red-500' : ''}
          >
            <option value="">Selecciona...</option>
            <option value="business">Del negocio</option>
            <option value="employment">Empleo</option>
            <option value="other">Otra fuente</option>
          </select>
          {errors.primaryIncomeSource && (
            <p className="text-sm text-red-400">{String(errors.primaryIncomeSource.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Ingreso mensual * ($)
          </label>
          <input
            type="number"
            placeholder="2000000"
            {...register('primaryIncomeMonthly', { valueAsNumber: true })}
            className={errors.primaryIncomeMonthly ? 'border-red-500' : ''}
          />
          {errors.primaryIncomeMonthly && (
            <p className="text-sm text-red-400">{String(errors.primaryIncomeMonthly.message)}</p>
          )}
        </div>
      </div>

      {/* Secondary Income */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('hasSecondaryIncome')}
            className="w-4 h-4 rounded border-slate-600"
          />
          <span className="text-sm font-medium text-slate-300">
            ¿Tiene ingreso adicional?
          </span>
        </label>

        {watch('hasSecondaryIncome') && (
          <div className="space-y-2 pl-7">
            <label className="block text-sm font-medium text-slate-300">
              Ingreso adicional mensual ($)
            </label>
            <input
              type="number"
              placeholder="500000"
              {...register('secondaryIncomeMonthly', { valueAsNumber: true })}
              className={errors.secondaryIncomeMonthly ? 'border-red-500' : ''}
            />
            {errors.secondaryIncomeMonthly && (
              <p className="text-sm text-red-400">{String(errors.secondaryIncomeMonthly.message)}</p>
            )}
          </div>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 11 - Spouse Income (CRITICAL) */}
      {watch('hasSpouse') && (
        <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <h3 className="font-medium text-slate-300">Ingreso del cónyuge/co-obligado</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Fuente de ingreso (opcional)
            </label>
            <select
              {...register('spouseIncomeSource')}
              className={errors.spouseIncomeSource ? 'border-red-500' : ''}
            >
              <option value="">Selecciona...</option>
              <option value="business">Del negocio</option>
              <option value="employment">Empleo</option>
              <option value="other">Otra fuente</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Ingreso mensual ($) (opcional)
              </label>
              <input
                type="number"
                placeholder="1000000"
                {...register('spouseIncomeMonthly', { valueAsNumber: true })}
                className={errors.spouseIncomeMonthly ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Otros ingresos mensuales ($) (opcional)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('spouseOtherIncomeMonthly', { valueAsNumber: true })}
                className={errors.spouseOtherIncomeMonthly ? 'border-red-500' : ''}
              />
            </div>
          </div>
        </div>
      )}

      {/* From Excel: Solicitud de Crédito, Section 11 - Co-applicant Income */}
      {watch('hasCoapplicant') && (
        <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
          <h3 className="font-medium text-slate-300">Ingreso del co-deudor</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Ingreso mensual ($) (opcional)
            </label>
            <input
              type="number"
              placeholder="1500000"
              {...register('coapplicantMonthlyIncome', { valueAsNumber: true })}
              className={errors.coapplicantMonthlyIncome ? 'border-red-500' : ''}
            />
          </div>
        </div>
      )}

      {/* From Excel: Solicitud de Crédito, Section 11 - Detailed Expenses */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-red-400">Gastos mensuales detallados (opcional)</h3>
        <p className="text-xs text-slate-400">Ingrese los gastos mensuales en cada categoría</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Arriendo/Cuota vivienda ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseHousing', { valueAsNumber: true })}
              className={errors.expenseHousing ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Alimentación ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseFood', { valueAsNumber: true })}
              className={errors.expenseFood ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Servicios públicos ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseUtilities', { valueAsNumber: true })}
              className={errors.expenseUtilities ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Transporte ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseTransport', { valueAsNumber: true })}
              className={errors.expenseTransport ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Educación ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseEducation', { valueAsNumber: true })}
              className={errors.expenseEducation ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Salud ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseHealth', { valueAsNumber: true })}
              className={errors.expenseHealth ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Vestuario ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseClothing', { valueAsNumber: true })}
              className={errors.expenseClothing ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Recreación ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseRecreation', { valueAsNumber: true })}
              className={errors.expenseRecreation ? 'border-red-500' : ''}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Otros gastos ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('expenseOther', { valueAsNumber: true })}
              className={errors.expenseOther ? 'border-red-500' : ''}
            />
          </div>
        </div>
      </div>

      {/* Legacy Expenses Section */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-red-400">Resumen de gastos mensuales *</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Gastos del hogar ($) *
            </label>
            <input
              type="number"
              placeholder="800000"
              {...register('householdExpensesMonthly', { valueAsNumber: true })}
              className={errors.householdExpensesMonthly ? 'border-red-500' : ''}
            />
            {errors.householdExpensesMonthly && (
              <p className="text-sm text-red-400">{String(errors.householdExpensesMonthly.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Gastos del negocio ($) *
            </label>
            <input
              type="number"
              placeholder="300000"
              {...register('businessExpensesMonthly', { valueAsNumber: true })}
              className={errors.businessExpensesMonthly ? 'border-red-500' : ''}
            />
            {errors.businessExpensesMonthly && (
              <p className="text-sm text-red-400">{String(errors.businessExpensesMonthly.message)}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Otras obligaciones de deuda ($) *
          </label>
          <input
            type="number"
            placeholder="100000"
            {...register('debtObligationsMonthly', { valueAsNumber: true })}
            className={errors.debtObligationsMonthly ? 'border-red-500' : ''}
          />
          {errors.debtObligationsMonthly && (
            <p className="text-sm text-red-400">{String(errors.debtObligationsMonthly.message)}</p>
          )}
        </div>
      </div>

      {/* Additional Expenses - Commercial */}
      {productType === 'commercial' && (
        <div className="space-y-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <h3 className="font-medium text-slate-300">Gastos específicos del negocio (opcional)</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Salario del propietario ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('businessOwnerSalary', { valueAsNumber: true })}
                className={errors.businessOwnerSalary ? 'border-red-500' : ''}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Margen de ganancia (%)
              </label>
              <input
                type="number"
                placeholder="0"
                step="0.1"
                min="0"
                max="100"
                {...register('businessProfitMargin', { valueAsNumber: true })}
                className={errors.businessProfitMargin ? 'border-red-500' : ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Servicios/utilidades ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('utilitiesOperatingCosts', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Arriendo del negocio ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('businessRent', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Seguros ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('insurancePayments', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Transporte/logística ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('transportationCosts', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Honorarios profesionales ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('professionalFees', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Mantenimiento ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('maintenanceCosts', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Marketing/publicidad ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('marketingAdvertising', { valueAsNumber: true })}
            />
          </div>
        </div>
      )}

      {/* Agricultural Income - Seasonal */}
      {productType === 'agricultural' && (
        <div className="space-y-4 p-4 bg-slate-800/20 rounded-lg border border-slate-700 border-dashed">
          <h3 className="font-medium text-slate-300">Información agropecuaria (opcional)</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Tipo de cultivo/ganadería
              </label>
              <input
                type="text"
                placeholder="Arroz, café, ganado, etc."
                {...register('cropLivestockType')}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Ciclos por año
              </label>
              <input
                type="number"
                placeholder="2"
                min="1"
                max="12"
                {...register('productionCyclesPerYear', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Última cosecha (cantidad)
              </label>
              <input
                type="number"
                placeholder="1000"
                {...register('lastHarvestAmount', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Precio promedio de mercado ($)
              </label>
              <input
                type="number"
                placeholder="50000"
                {...register('marketPriceAverage', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Costos de producción por ciclo ($)
            </label>
            <input
              type="number"
              placeholder="100000"
              {...register('productionCostsPerCycle', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Costos de riego ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('irrigationCosts', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Alimentos/fertilizante ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('feedFertilizerCosts', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Costos veterinarios ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('veterinaryCosts', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Almacenamiento/post-cosecha ($)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('storagePostHarvestCosts', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Transporte/distribución ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('distributionTransportationCosts', { valueAsNumber: true })}
            />
          </div>
        </div>
      )}

      {/* From Excel: Solicitud de Crédito, Section 10 - Balance Sheet */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300">Balance General (Estado Financiero) - Opcional</h3>

        {/* Assets Section */}
        <div className="space-y-3 border-b border-slate-700 pb-4">
          <h4 className="font-medium text-emerald-400 text-sm">Activos (Bienes)</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Efectivo/Bancos ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetCash', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Cuentas por Cobrar ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetAccountsReceivable', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Inventarios ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetInventory', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Valor del Negocio ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetBusinessValue', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Maquinaria ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetMachinery', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Vehículos ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetVehicles', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Otros Activos ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('assetOther', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="space-y-3 pt-4">
          <h4 className="font-medium text-red-400 text-sm">Pasivos (Deudas)</h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Obligaciones Corto Plazo ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('liabilityShortTerm', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Proveedores ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('liabilitySuppliers', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-300">Obligaciones Largo Plazo ($)</label>
              <input
                type="number"
                placeholder="0"
                {...register('liabilityLongTerm', { valueAsNumber: true })}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Savings */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">
          Monto ahorrado * ($)
        </label>
        <input
          type="number"
          placeholder="500000"
          {...register('savingsAmount', { valueAsNumber: true })}
          className={errors.savingsAmount ? 'border-red-500' : ''}
        />
        {errors.savingsAmount && (
          <p className="text-sm text-red-400">{String(errors.savingsAmount.message)}</p>
        )}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 9 - References */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300">Referencias (Opcional)</h3>
        <p className="text-xs text-slate-400">Ingrese hasta 3 referencias personales o comerciales</p>

        {[1, 2, 3].map((ref) => (
          <div key={ref} className="space-y-3 p-3 bg-slate-800/20 rounded border border-slate-700">
            <h4 className="text-xs font-medium text-slate-400">Referencia {ref}</h4>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Nombre completo"
                {...register(`reference${ref}Name`)}
                className="text-sm"
              />

              <input
                type="tel"
                placeholder="Teléfono"
                {...register(`reference${ref}Phone`)}
                className="text-sm"
              />

              <input
                type="text"
                placeholder="Dirección"
                {...register(`reference${ref}Address`)}
                className="text-sm col-span-2"
              />

              <input
                type="text"
                placeholder="Relación (amigo, comerciante, etc.)"
                {...register(`reference${ref}Relationship`)}
                className="text-sm col-span-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* From Excel: Solicitud de Crédito, Section 8 - Collateral */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300">Garantía/Colateral (Opcional)</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Tipo de propiedad
            </label>
            <select
              {...register('collateralPropertyType')}
              className={errors.collateralPropertyType ? 'border-red-500' : ''}
            >
              <option value="">Sin garantía</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="lote">Lote</option>
              <option value="finca">Finca</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Avalúo comercial ($)
            </label>
            <input
              type="number"
              placeholder="0"
              {...register('collateralAppraisalValue', { valueAsNumber: true })}
              className={errors.collateralAppraisalValue ? 'border-red-500' : ''}
            />
          </div>
        </div>

        {watch('collateralPropertyType') && watch('collateralPropertyType') !== '' && (
          <div className="space-y-3 p-3 bg-slate-800/20 rounded border border-slate-700">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Ciudad"
                {...register('collateralCity')}
                className="text-sm"
              />

              <input
                type="text"
                placeholder="Dirección"
                {...register('collateralAddress')}
                className="text-sm"
              />

              <input
                type="text"
                placeholder="Matrícula Inmobiliaria"
                {...register('collateralRegistryNumber')}
                className="text-sm"
              />

              <input
                type="date"
                {...register('collateralDocumentDate')}
                className="text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-slate-300">Resumen financiero mensual</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Ingreso total:</span>
            <span className="text-emerald-400">${totalIncome.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Gastos totales:</span>
            <span className="text-red-400">${totalExpenses.toLocaleString('es-CO')}</span>
          </div>
          <div className="border-t border-slate-700 pt-2 flex justify-between">
            <span className="text-slate-300 font-medium">Ingreso neto:</span>
            <span className={netIncome >= 0 ? 'text-emerald-400' : 'text-red-400'}>
              ${netIncome.toLocaleString('es-CO')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
