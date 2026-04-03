'use client'

import { useFormContext } from 'react-hook-form'

export function FormStep7() {
  const { formState: { errors }, register } = useFormContext<any>()

  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })

  const currencyInput = (fieldName: string) => ({
    ...register(fieldName, { valueAsNumber: true }),
    type: 'number',
    placeholder: '0',
    className: 'px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Balance General - Activos</h2>
        <p className="text-slate-400 text-sm">Paso 7 de 11</p>
      </div>

      {/* CURRENT ASSETS */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Activos Corrientes</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Caja y Equivalentes ($)
            </label>
            <input {...currencyInput('cashAndEquivalents')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Cuentas de Ahorro ($)
            </label>
            <input {...currencyInput('savingsAccounts')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Cuentas Corrientes ($)
            </label>
            <input {...currencyInput('checkingAccounts')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Fondos del Mercado Monetario ($)
            </label>
            <input {...currencyInput('moneyMarketAccounts')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Inversiones a Corto Plazo ($)
            </label>
            <input {...currencyInput('shortTermInvestments')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Cuentas por Cobrar Comercial ($)
            </label>
            <input {...currencyInput('accountsReceivableTrade')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Otras Cuentas por Cobrar ($)
            </label>
            <input {...currencyInput('accountsReceivableOther')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Inventario - Materia Prima ($)
            </label>
            <input {...currencyInput('inventoryRawMaterials')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Inventario - Productos Terminados ($)
            </label>
            <input {...currencyInput('inventoryFinishedGoods')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Inventario - Mercancías ($)
            </label>
            <input {...currencyInput('inventoryMerchandise')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Gastos Pagados por Anticipado ($)
            </label>
            <input {...currencyInput('prepaidExpenses')} />
          </div>
        </div>
      </div>

      {/* FIXED ASSETS */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Activos Fijos</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Terreno ($)
            </label>
            <input {...currencyInput('land')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Edificios y Estructuras ($)
            </label>
            <input {...currencyInput('buildingsStructures')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Muebles y Enseres ($)
            </label>
            <input {...currencyInput('furnitureFixtures')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Maquinaria y Equipo ($)
            </label>
            <input {...currencyInput('machineryEquipment')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Vehículos ($)
            </label>
            <input {...currencyInput('vehiclesFixed')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Depreciación Acumulada ($)
            </label>
            <input {...currencyInput('accumulatedDepreciation')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Bienes Intangibles y Fondo Comercial ($)
            </label>
            <input {...currencyInput('intangibleGoodwill')} />
          </div>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-blue-300">Nota:</span> Introduce los valores en pesos colombianos (COP).
          Los valores de inventario y cuentas por cobrar se usan para calcular ciclos operativos.
        </p>
      </div>
    </div>
  )
}
