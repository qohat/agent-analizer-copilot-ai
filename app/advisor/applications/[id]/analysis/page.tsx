'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AnalysisCommercial } from '@/components/AnalysisCommercial'
import { AnalysisAgricultural } from '@/components/AnalysisAgricultural'

export default function AnalysisPage() {
  const params = useParams()
  const applicationId = params.id as string

  const [application, setApplication] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch(`/api/applications/${applicationId}`)
        if (!response.ok) throw new Error('Failed to fetch application')
        const data = await response.json()
        // Handle both response formats
        setApplication(data.application || data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading application')
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [applicationId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4" />
          <p className="text-slate-300">Cargando análisis...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-400 mb-2">Error</h1>
            <p className="text-slate-300">
              {error || 'No se pudo cargar la solicitud'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Análisis de solicitud</h1>
            <p className="text-slate-400">ID: {applicationId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Solicitante</p>
            <p className="text-xl font-semibold text-slate-100">
              {application.client_first_name} {application.client_last_name}
            </p>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          {application.product_type === 'commercial' || application.application_type === 'commercial' ? (
            <AnalysisCommercial applicationData={application} />
          ) : (
            <AnalysisAgricultural applicationData={application} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition"
          >
            Volver
          </button>
          <button
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            Enviar al comité
          </button>
        </div>
      </div>
    </div>
  )
}
