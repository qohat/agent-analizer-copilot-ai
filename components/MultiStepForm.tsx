'use client'

import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
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

const STORAGE_KEY = 'credit-application-draft'

export function MultiStepForm() {
  const { user, session } = useAuth()
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
    // Don't use resolver here - it changes per step and can lose data
    // We'll validate manually when needed
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldUnregister: false,
    defaultValues: {
      bienesRaices: [],
      vehiculos: [],
    },
  })

  // Load data from localStorage on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        methods.reset(parsed.formData)
        setStep(parsed.currentStep || 1)
      } catch (error) {
        console.error('Error loading saved data:', error)
      }
    }
  }, [methods])

  // Save data to localStorage whenever form changes
  React.useEffect(() => {
    const subscription = methods.watch((formData) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          formData,
          currentStep: step,
          lastSaved: new Date().toISOString(),
        }))
      } catch (error) {
        console.error('Error saving data:', error)
      }
    })
    return () => subscription.unsubscribe()
  }, [methods, step])

  // Clear errors when step changes
  React.useEffect(() => {
    methods.clearErrors()
  }, [step, methods])

  const onNextStep = async () => {
    // Get current form values
    const currentValues = methods.getValues()

    // Validate only the current step's fields
    const currentSchema = schemas[step - 1]
    const validationResult = currentSchema.safeParse(currentValues)

    if (validationResult.success && step < TOTAL_STEPS) {
      // Valid, move to next step
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (!validationResult.success) {
      // Invalid, show errors
      console.warn('Step validation failed:', validationResult.error.errors)

      // Set errors manually
      validationResult.error.errors.forEach((error) => {
        const fieldName = error.path.join('.') as any
        methods.setError(fieldName, {
          type: 'manual',
          message: error.message,
        })
      })

      // Scroll to first error
      const firstError = validationResult.error.errors[0]
      if (firstError && firstError.path.length > 0) {
        const fieldName = firstError.path.join('.')
        const element = document.getElementsByName(fieldName)[0]
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
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
      // Import the mapper function and diagnostic tools
      const { mapFormDataToApplicationCreate } = await import('@/lib/validation/form-mapper')
      const { diagnoseFormData, compareFormData } = await import('@/lib/validation/diagnose-mapper')

      // Map Spanish field names to English field names expected by the API
      const mappedData = mapFormDataToApplicationCreate(data)

      console.log('Form data (raw):', data)
      console.log('Form data (mapped):', mappedData)

      // Run diagnostic
      compareFormData(data, mappedData)
      diagnoseFormData(mappedData)

      // Check if user is authenticated
      if (!user || !session?.access_token) {
        alert('Debes iniciar sesión para enviar una solicitud')
        return
      }

      // Submit to backend API with JWT token
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(mappedData),
      })

      if (response.ok) {
        setSubmitted(true)
        // Clear localStorage after successful submission
        localStorage.removeItem(STORAGE_KEY)
      } else {
        const errorData = await response.json()
        console.error('Submission failed:', response.statusText, errorData)

        // Log detailed validation errors
        if (errorData.details) {
          console.error('Validation errors:')
          if (Array.isArray(errorData.details)) {
            errorData.details.forEach((err: any, index: number) => {
              console.error(`  ${index + 1}. Field: ${err.path?.join('.') || 'unknown'}`)
              console.error(`     Expected: ${err.expected}`)
              console.error(`     Received: ${err.received}`)
              console.error(`     Message: ${err.message}`)
            })
          } else {
            console.error(`  ${errorData.details}`)
          }
        }

        alert(`Error al enviar la solicitud: ${errorData.error || response.statusText}\n\nRevisa la consola para más detalles.`)
      }
    } catch (err) {
      console.error('Submission error:', err)
      alert('Error al enviar la solicitud. Por favor, intenta de nuevo.')
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
