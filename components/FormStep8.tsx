'use client'

import { useFormContext } from 'react-hook-form'

export function FormStep8() {
  const { formState: { errors }, register } = useFormContext<any>()

  const currencyInput = (fieldName: string) => ({
    ...register(fieldName, { valueAsNumber: true }),
    type: 'number',
    placeholder: '0',
    className: 'px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right',
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Balance General - Pasivos</h2>
        <p className="text-slate-400 text-sm">Paso 8 de 11</p>
      </div>

      {/* CURRENT LIABILITIES */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Pasivos Corrientes</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Cuentas por Pagar Comercial ($)
            </label>
            <input {...currencyInput('accountsPayableTrade')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Otras Cuentas por Pagar ($)
            </label>
            <input {...currencyInput('accountsPayableOther')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Préstamos a Corto Plazo ($)
            </label>
            <input {...currencyInput('shortTermLoans')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Saldos de Tarjetas de Crédito ($)
            </label>
            <input {...currencyInput('creditCardBalances')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Porción Corriente de Deuda a Largo Plazo ($)
            </label>
            <input {...currencyInput('currentPortionLtDebt')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Nómina Acumulada ($)
            </label>
            <input {...currencyInput('payrollAccrued')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Impuestos Acumulados ($)
            </label>
            <input {...currencyInput('taxesAccrued')} />
          </div>
        </div>
      </div>

      {/* LONG TERM LIABILITIES */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Pasivos a Largo Plazo</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Préstamos a Largo Plazo ($)
            </label>
            <input {...currencyInput('longTermLoans')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Deuda Hipotecaria ($)
            </label>
            <input {...currencyInput('mortgageDebt')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Financiamiento de Equipos ($)
            </label>
            <input {...currencyInput('equipmentFinancing')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Bonos por Pagar ($)
            </label>
            <input {...currencyInput('bondPayable')} />
          </div>
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-emerald-300">Resumen del Balance</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p className="flex justify-between">
            <span>Total Activos Corrientes:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="flex justify-between">
            <span>Total Activos Fijos:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="flex justify-between border-t border-slate-700 pt-2">
            <span className="font-semibold">Total Pasivos Corrientes:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Total Pasivos a Largo Plazo:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-blue-300">Nota:</span> El balance genera un análisis de liquidez
          y solvencia automático. Esto ayuda a evaluar la capacidad de pago.
        </p>
      </div>
    </div>
  )
}
