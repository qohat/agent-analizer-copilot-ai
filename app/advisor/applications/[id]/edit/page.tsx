'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { MultiStepForm } from '@/components/MultiStepForm'

/**
 * Application Edit Page
 * Allows advisors to edit draft applications with pre-populated form data
 */
export default function ApplicationEditPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/applications/${applicationId}`)
      if (!response.ok) throw new Error('Failed to fetch application')

      const data = await response.json()

      // Check if application can be edited (must be draft)
      if (data.status !== 'draft') {
        setError('Solo se pueden editar solicitudes en borrador')
        return
      }

      setApplication(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading application')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Cargando solicitud...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-4">
        <Link
          href={`/advisor/applications/${applicationId}`}
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a solicitud
        </Link>
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
          <h1 className="text-xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-slate-300">{error || 'No se pudo cargar la solicitud'}</p>
          <button
            onClick={fetchApplication}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/advisor/applications/${applicationId}`}
          className="text-slate-400 hover:text-slate-300 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Solicitud</h1>
          <p className="text-slate-400">
            {application.client?.first_name} {application.client?.last_name}
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          ℹ️ Está editando una solicitud en borrador. Los cambios se guardarán al completar cada paso.
        </p>
      </div>

      {/* Form Component with pre-populated data */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <EditableMultiStepForm
          applicationId={applicationId}
          initialData={application}
          onSaveComplete={() => router.push(`/advisor/applications/${applicationId}`)}
        />
      </div>
    </div>
  )
}

/**
 * Editable Multi-Step Form Component
 * Similar to MultiStepForm but pre-populates with existing data
 */
function EditableMultiStepForm({
  applicationId,
  initialData,
  onSaveComplete,
}: {
  applicationId: string
  initialData: any
  onSaveComplete: () => void
}) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // We'll use the same MultiStepForm component but pass initialData
  // For now, show a message that the form is loading

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <p className="text-slate-300 mb-4">
          Edición de formulario: En construcción
        </p>
        <Link
          href={`/advisor/applications/${applicationId}`}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition"
        >
          Volver a solicitud
        </Link>
      </div>

      {saveError && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{saveError}</p>
        </div>
      )}
    </div>
  )
}
