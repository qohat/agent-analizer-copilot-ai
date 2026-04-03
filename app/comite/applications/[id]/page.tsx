'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, Save } from 'lucide-react'
import { AnalysisCommercial } from '@/components/AnalysisCommercial'
import { AnalysisAgricultural } from '@/components/AnalysisAgricultural'

interface Application {
  id: string
  business_name?: string
  application_type?: string
  product_type?: string
  requested_amount?: number
  requested_months?: number
  status?: string
  created_at?: string
  updated_at?: string
  client_first_name?: string
  client_last_name?: string
  client_id_number?: string
  client_phone?: string
  client_email?: string
  address_street?: string
  address_city?: string
  address_department?: string
  marital_status?: string
  business_registration?: string
  business_type?: string
  business_sector?: string
  business_years_operating?: number
  client_monthly_income?: number
  spouse_income_monthly?: number
  secondary_income_monthly?: number
  monthly_personal_expenses?: number
  monthly_business_expenses?: number
  monthly_other_obligations?: number
  collateral_type?: string
  collateral_value?: number
  purpose?: string
  advisor?: { name: string }
}

type DecisionType = 'approve' | 'reject' | null

export default function ComiteReviewPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [decision, setDecision] = useState<DecisionType>(null)
  const [approvedAmount, setApprovedAmount] = useState<string>('')
  const [approvedMonths, setApprovedMonths] = useState<string>('')
  const [approvedRate, setApprovedRate] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

  useEffect(() => {
    // Initialize approved fields with requested values
    if (application) {
      setApprovedAmount(application.requested_amount?.toString() || '')
      setApprovedMonths(application.requested_months?.toString() || '')
    }
  }, [application])

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/applications/${applicationId}`)
      if (!response.ok) throw new Error('Failed to fetch application')

      const data = await response.json()
      setApplication(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading application')
    } finally {
      setLoading(false)
    }
  }

  const handleDecision = async () => {
    if (!application || !decision || !notes.trim()) {
      setError('Por favor, completa la decisión y las notas')
      return
    }

    try {
      setSubmitting(true)

      const endpoint = decision === 'approve' ? '/api/decisions/approve' : '/api/decisions/reject'
      const payload: any = {
        application_id: applicationId,
        notes,
        reviewed_at: new Date().toISOString(),
      }

      if (decision === 'approve') {
        payload.approved_amount = parseFloat(approvedAmount) || application.requested_amount
        payload.approved_months = parseInt(approvedMonths) || application.requested_months
        payload.approved_rate = parseFloat(approvedRate) || 0
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to submit decision')

      setApplication((prev) =>
        prev
          ? {
            ...prev,
            status: decision === 'approve' ? 'approved' : 'rejected',
          }
          : null
      )

      // Redirect to applications list after 2 seconds
      setTimeout(() => {
        router.push('/comite/applications')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting decision')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'under_review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50'
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-slate-700 text-slate-200'
    }
  }

  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case 'submitted':
        return 'Enviada'
      case 'under_review':
        return 'En revisión'
      case 'approved':
        return 'Aprobada'
      case 'rejected':
        return 'Rechazada'
      default:
        return status || 'Desconocida'
    }
  }

  const getApplicationType = (app: Application): string => {
    const type = app.application_type || app.product_type || 'unknown'
    return type === 'commercial' ? 'Comercial' : type === 'agricultural' ? 'Agrícola' : 'Desconocida'
  }

  const formatCurrency = (amount?: number): string => {
    if (!amount) return '$0'
    return `$${amount.toLocaleString('es-CO')}`
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Cargando solicitud...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="space-y-4">
        <Link
          href="/comite/applications"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a solicitudes
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

  const totalIncome = (application.client_monthly_income || 0) +
    (application.spouse_income_monthly || 0) +
    (application.secondary_income_monthly || 0)

  const totalExpenses = (application.monthly_personal_expenses || 0) +
    (application.monthly_business_expenses || 0) +
    (application.monthly_other_obligations || 0)

  const debtToIncomeRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/comite/applications"
            className="text-slate-400 hover:text-slate-300 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {application.client_first_name} {application.client_last_name}
            </h1>
            <p className="text-slate-400">Solicitud #{applicationId}</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
            {getStatusLabel(application.status)}
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Recibida: {formatDate(application.created_at)}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Tipo de crédito</p>
          <p className="text-lg font-semibold text-slate-100">{getApplicationType(application)}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Monto solicitado</p>
          <p className="text-lg font-semibold text-emerald-400">{formatCurrency(application.requested_amount)}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Asesor</p>
          <p className="text-lg font-semibold text-slate-100">{application.advisor?.name || '-'}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Relación deuda-ingreso</p>
          <p className="text-lg font-semibold text-slate-100">{debtToIncomeRatio}%</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-700">
        <div className="flex gap-8">
          <button className="px-4 py-3 border-b-2 border-purple-400 text-purple-400 font-medium transition">
            Información
          </button>
          <button className="px-4 py-3 border-b-2 border-transparent text-slate-400 hover:text-slate-300 font-medium transition">
            Análisis
          </button>
        </div>
      </div>

      {/* Application Details */}
      <div className="space-y-4">
        {/* Personal Information */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Información Personal</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Cédula</p>
              <p className="font-medium text-slate-100">{application.client_id_number}</p>
            </div>
            <div>
              <p className="text-slate-400">Teléfono</p>
              <p className="font-medium text-slate-100">{application.client_phone}</p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-medium text-slate-100">{application.client_email}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-400">Dirección</p>
              <p className="font-medium text-slate-100">
                {application.address_street}, {application.address_city}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Ingresos mensuales</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal</span>
                <span className="font-medium">{formatCurrency(application.client_monthly_income)}</span>
              </div>
              {application.secondary_income_monthly ? (
                <div className="flex justify-between">
                  <span className="text-slate-400">Secundario</span>
                  <span className="font-medium">{formatCurrency(application.secondary_income_monthly)}</span>
                </div>
              ) : null}
              {application.spouse_income_monthly ? (
                <div className="flex justify-between">
                  <span className="text-slate-400">Cónyuge</span>
                  <span className="font-medium">{formatCurrency(application.spouse_income_monthly)}</span>
                </div>
              ) : null}
              <div className="pt-2 border-t border-slate-600 flex justify-between font-semibold text-emerald-400">
                <span>Total</span>
                <span>{formatCurrency(totalIncome)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Gastos mensuales</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Personales</span>
                <span className="font-medium">{formatCurrency(application.monthly_personal_expenses)}</span>
              </div>
              {application.monthly_business_expenses ? (
                <div className="flex justify-between">
                  <span className="text-slate-400">Negocio</span>
                  <span className="font-medium">{formatCurrency(application.monthly_business_expenses)}</span>
                </div>
              ) : null}
              {application.monthly_other_obligations ? (
                <div className="flex justify-between">
                  <span className="text-slate-400">Otras obligaciones</span>
                  <span className="font-medium">{formatCurrency(application.monthly_other_obligations)}</span>
                </div>
              ) : null}
              <div className="pt-2 border-t border-slate-600 flex justify-between font-semibold text-red-400">
                <span>Total</span>
                <span>{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Análisis de IA
        </h2>

        {application.application_type === 'commercial' || application.product_type === 'commercial' ? (
          <AnalysisCommercial applicationData={application} />
        ) : (
          <AnalysisAgricultural applicationData={application} />
        )}
      </div>

      {/* Decision Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold">Decisión del comité</h2>

        {/* Error message if submission failed */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Decision Radio Buttons */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition">
            <input
              type="radio"
              value="approve"
              checked={decision === 'approve'}
              onChange={(e) => setDecision(e.target.value as DecisionType)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-emerald-400">Aprobar solicitud</p>
              <p className="text-xs text-slate-400">La solicitud cumple con los criterios</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition">
            <input
              type="radio"
              value="reject"
              checked={decision === 'reject'}
              onChange={(e) => setDecision(e.target.value as DecisionType)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold text-red-400">Rechazar solicitud</p>
              <p className="text-xs text-slate-400">La solicitud no cumple con los criterios</p>
            </div>
          </label>
        </div>

        {/* Conditional Fields for Approval */}
        {decision === 'approve' && (
          <div className="space-y-3 bg-emerald-500/5 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-sm text-emerald-400 font-medium">Términos de la aprobación</p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Monto aprobado</label>
                <input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Meses aprobados</label>
                <input
                  type="number"
                  value={approvedMonths}
                  onChange={(e) => setApprovedMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Tasa (%) (opcional)</label>
                <input
                  type="number"
                  step="0.1"
                  value={approvedRate}
                  onChange={(e) => setApprovedRate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Decision Notes */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Notas de la decisión {!notes.trim() && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explica brevemente la razón de esta decisión..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition resize-none"
            rows={4}
          />
          <p className="text-xs text-slate-500 mt-1">
            {notes.length}/500 caracteres
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end border-t border-slate-700 pt-6">
        <Link
          href="/comite/applications"
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition"
        >
          Cancelar
        </Link>

        <button
          onClick={handleDecision}
          disabled={!decision || !notes.trim() || submitting}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Enviar decisión
            </>
          )}
        </button>
      </div>
    </div>
  )
}
