'use client'

import { useFormContext } from 'react-hook-form'

export function FormStep9() {
  const { formState: { errors }, register, watch } = useFormContext<any>()

  const currencyInput = (fieldName: string) => ({
    ...register(fieldName, { valueAsNumber: true }),
    type: 'number',
    placeholder: '0',
    className: 'px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right',
  })

  const incomeClientFields = [
    { id: 'incomeClientBusinessOperations', label: 'Operaciones Comerciales' },
    { id: 'incomeClientEmploymentSalary', label: 'Salario de Empleo' },
    { id: 'incomeClientSelfEmployment', label: 'Trabajo Independiente' },
    { id: 'incomeClientRentals', label: 'Rentas' },
    { id: 'incomeClientDividendsInterest', label: 'Dividendos e Intereses' },
    { id: 'incomeClientPension', label: 'Pensión' },
    { id: 'incomeClientGovernmentAssistance', label: 'Ayuda Gubernamental' },
    { id: 'incomeClientOther', label: 'Otra Fuente' },
  ]

  const expenseFields = [
    { id: 'householdHousingRentMortgage', label: 'Vivienda (Arriendo/Hipoteca)' },
    { id: 'householdUtilitiesElectricity', label: 'Servicios - Electricidad' },
    { id: 'householdUtilitiesWater', label: 'Servicios - Agua' },
    { id: 'householdUtilitiesGas', label: 'Servicios - Gas' },
    { id: 'householdUtilitiesInternet', label: 'Servicios - Internet' },
    { id: 'householdFoodGroceries', label: 'Alimentación' },
    { id: 'householdTransportationPublic', label: 'Transporte Público' },
    { id: 'householdTransportationVehicleFuel', label: 'Transporte - Combustible' },
    { id: 'householdTransportationMaintenance', label: 'Transporte - Mantenimiento' },
    { id: 'householdTransportationInsurance', label: 'Transporte - Seguro' },
    { id: 'householdEducationTuition', label: 'Educación - Matrícula' },
    { id: 'householdEducationSupplies', label: 'Educación - Útiles' },
    { id: 'householdHealthcareInsurance', label: 'Salud - Seguro' },
    { id: 'householdHealthcareMedications', label: 'Salud - Medicinas' },
    { id: 'householdHealthcareOther', label: 'Salud - Otros' },
    { id: 'householdChildcare', label: 'Cuidado de Niños' },
    { id: 'householdPersonalGrooming', label: 'Cuidado Personal' },
    { id: 'householdClothing', label: 'Vestuario' },
    { id: 'householdRecreationEntertainment', label: 'Entretenimiento' },
    { id: 'householdPhoneCellular', label: 'Teléfono Celular' },
    { id: 'householdSubscriptions', label: 'Suscripciones' },
    { id: 'householdPetCare', label: 'Cuidado de Mascotas' },
    { id: 'householdPersonalCare', label: 'Cuidado Personal' },
    { id: 'householdMiscellaneous', label: 'Varios' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Ingresos y Gastos Mensuales</h2>
        <p className="text-slate-400 text-sm">Paso 9 de 11</p>
      </div>

      {/* CLIENT INCOME */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Ingresos Mensuales del Solicitante</h3>

        <div className="grid grid-cols-2 gap-4">
          {incomeClientFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {field.label} ($)
              </label>
              <input {...currencyInput(field.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* SPOUSE INCOME */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Ingresos Mensuales del Cónyuge (Opcional)</h3>

        <div className="grid grid-cols-2 gap-4">
          {incomeClientFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {field.label} (Cónyuge) ($)
              </label>
              <input
                {...register(`incomeSpouse${field.id.replace('incomeClient', '')}`, { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 text-right"
              />
            </div>
          ))}
        </div>
      </div>

      {/* HOUSEHOLD EXPENSES */}
      <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
        <h3 className="font-medium text-slate-300 text-lg">Gastos Mensuales Familiares</h3>
        <p className="text-xs text-slate-400 mb-4">Incluye todos los gastos del hogar</p>

        <div className="grid grid-cols-2 gap-4">
          {expenseFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                {field.label} ($)
              </label>
              <input {...currencyInput(field.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold text-emerald-300">Resumen de Ingresos y Gastos</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p className="flex justify-between">
            <span>Total Ingresos Solicitante:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="flex justify-between">
            <span>Total Ingresos Cónyuge:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="flex justify-between">
            <span>Total Ingresos Familiares:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="border-t border-slate-700 pt-2 flex justify-between">
            <span>Total Gastos Mensuales:</span>
            <span className="font-semibold">Se calcula automáticamente</span>
          </p>
          <p className="flex justify-between text-emerald-300 font-semibold">
            <span>Flujo de Caja Disponible:</span>
            <span>Se calcula automáticamente</span>
          </p>
        </div>
      </div>

      {/* INFO BOX */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-slate-300">
        <p>
          <span className="font-semibold text-blue-300">Nota:</span> Todos los valores deben estar en pesos colombianos (COP)
          y ser cantidades mensuales promedio. Esto incluye la proyección de ingresos agrícolas si aplica.
        </p>
      </div>
    </div>
  )
}
