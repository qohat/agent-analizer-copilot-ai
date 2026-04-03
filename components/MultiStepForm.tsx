'use client'

import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  applicationStep1Schema,
  applicationStep2Schema,
  applicationStep3Schema,
  applicationStep4Schema,
  applicationStep5Schema,
  applicationStep6Schema,
  applicationStep78Schema,
  applicationStep9Schema,
  applicationStep10Schema,
  applicationStep11Schema,
} from '@/lib/validation/schemas'
import { FormStep1 } from './FormStep1'
import { FormStep2 } from './FormStep2'
import { FormStep3 } from './FormStep3'
import { FormStep4 } from './FormStep4'
import { FormStep5 } from './FormStep5'
import { FormStep6 } from './FormStep6'
import { FormStep7 } from './FormStep7'
import { FormStep8 } from './FormStep8'
import { FormStep9 } from './FormStep9'
import { FormStep10 } from './FormStep10'
import { FormStep11 } from './FormStep11'
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react'

const TOTAL_STEPS = 11

export function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const schemas = [
    applicationStep1Schema,
    applicationStep2Schema,
    applicationStep3Schema,
    applicationStep4Schema,
    applicationStep5Schema,
    applicationStep6Schema,
    applicationStep78Schema,
    applicationStep78Schema, // Step 7 and 8 use same schema
    applicationStep9Schema,
    applicationStep10Schema,
    applicationStep11Schema,
  ]

  const methods = useForm({
    resolver: zodResolver(schemas[step - 1]),
    mode: 'onBlur',
    shouldUnregister: false,
  })

  const onNextStep = async () => {
    const isValid = await methods.trigger()
    if (isValid && step < TOTAL_STEPS) {
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
          {step === 1 && <FormStep1 />}
          {step === 2 && <FormStep2 />}
          {step === 3 && <FormStep3 />}
          {step === 4 && <FormStep4 />}
          {step === 5 && <FormStep5 />}
          {step === 6 && <FormStep6 />}
          {step === 7 && <FormStep7 />}
          {step === 8 && <FormStep8 />}
          {step === 9 && <FormStep9 />}
          {step === 10 && <FormStep10 />}
          {step === 11 && <FormStep11 />}
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
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
