'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { step1SolicitudSchema } from '@/lib/validation/step1-solicitud.schema'
import { step2TipoProductoSchema } from '@/lib/validation/step2-tipo-producto.schema'
import { step3DatosPersonalesSchema } from '@/lib/validation/step3-datos-personales.schema'
import { step4DomicilioSchema } from '@/lib/validation/step4-domicilio.schema'
import { step5NegocioSchema } from '@/lib/validation/step5-negocio.schema'
import {
  step6ConyugeSchema,
  step7BienesSchema,
  step8BalanceSchema,
  step9IngresosGastosSchema,
  step10CapacidadPagoSchema,
  step11ResumenSchema,
} from '@/lib/validation/step6-11-schemas'
import { FormStep1New } from './FormStep1New'
import { FormStep2New } from './FormStep2New'
import { FormStep3New } from './FormStep3New'
import { FormStep4New } from './FormStep4New'
import { FormStep5New } from './FormStep5New'
import {
  FormStep6New,
  FormStep7New,
  FormStep8New,
  FormStep9New,
  FormStep10New,
  FormStep11New,
} from './FormSteps6-11'
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'

const TOTAL_STEPS = 11

export function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const schemas = [
    step1SolicitudSchema,       // Step 1: Datos de Solicitud ✅
    step2TipoProductoSchema,    // Step 2: Tipo de Producto ✅
    step3DatosPersonalesSchema, // Step 3: Datos Personales ✅
    step4DomicilioSchema,       // Step 4: Domicilio ✅
    step5NegocioSchema,         // Step 5: Negocio ✅
    step6ConyugeSchema,         // Step 6: Cónyuge ✅
    step7BienesSchema,          // Step 7: Bienes y Referencias ✅
    step8BalanceSchema,         // Step 8: Balance General ✅
    step9IngresosGastosSchema,  // Step 9: Ingresos y Gastos ✅
    step10CapacidadPagoSchema,  // Step 10: Capacidad de Pago ✅
    step11ResumenSchema,        // Step 11: Resumen y Envío ✅
  ]

  const methods = useForm({
    resolver: zodResolver(schemas[step - 1]),
    mode: 'onChange',  // Real-time validation for better UX
    reValidateMode: 'onChange',
    shouldUnregister: false,
  })

  // Update resolver when step changes
  React.useEffect(() => {
    methods.clearErrors()
  }, [step, methods])

  // Check if current step has validation errors
  const hasErrors = Object.keys(methods.formState.errors).length > 0

  const onNextStep = async () => {
    // Trigger validation to show all errors
    const stepIsValid = await methods.trigger()
    if (stepIsValid && step < TOTAL_STEPS) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onPreviousStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      // Submit to backend API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setSubmitted(true)
      } else {
        console.error('Submission failed:', response.statusText)
      }
    } catch (err) {
      console.error('Submission error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">¡Solicitud enviada!</h2>
          <p className="text-slate-400">
            Tu aplicación ha sido registrada. Se sincronizará automáticamente cuando haya conexión.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/advisor/dashboard'}
          className="px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition"
        >
          Ir al dashboard
        </button>
      </div>
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i + 1}
                className={`flex-1 h-2 rounded-full transition ${
                  i + 1 <= step ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-right">
            Paso {step} de {TOTAL_STEPS}
          </p>
        </div>

        {/* Form Steps */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          {step === 1 && <FormStep1New />}
          {step === 2 && <FormStep2New />}
          {step === 3 && <FormStep3New />}
          {step === 4 && <FormStep4New />}
          {step === 5 && <FormStep5New />}
          {step === 6 && <FormStep6New />}
          {step === 7 && <FormStep7New />}
          {step === 8 && <FormStep8New />}
          {step === 9 && <FormStep9New />}
          {step === 10 && <FormStep10New />}
          {step === 11 && <FormStep11New />}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPreviousStep}
            disabled={step === 1 || loading}
            className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-500 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={onNextStep}
              disabled={loading || hasErrors}
              className="flex-1 px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              title={hasErrors ? 'Complete todos los campos requeridos correctamente' : 'Continuar al siguiente paso'}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar solicitud'
              )}
            </button>
          )}
        </div>

        {/* Auto-save notice */}
        <div className="text-xs text-slate-500 text-center">
          Tu progreso se guarda automáticamente en este dispositivo
        </div>
      </form>
    </FormProvider>
  )
}
