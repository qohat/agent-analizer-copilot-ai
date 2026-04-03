'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Eye, Edit2, Send } from 'lucide-react'

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
  client?: any
  client_first_name?: string
  client_last_name?: string
  client_id_number?: string
  client_phone?: string
  client_email?: string
  address_street?: string
  address_city?: string
  address_department?: string
  marital_status?: string
  spouse_first_name?: string
  spouse_last_name?: string
  spouse_monthly_income?: number
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
}

export default function ApplicationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApplication()
  }, [applicationId])

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

  const handleSubmit = async () => {
    if (!application) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/applications/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id: applicationId }),
      })

      if (!response.ok) throw new Error('Failed to submit application')

      setApplication((prev) => prev ? { ...prev, status: 'submitted' } : null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting application')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'draft':
        return 'bg-slate-700 text-slate-200'
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
      case 'draft':
        return 'Borrador'
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

  const totalIncome = (application?.client_monthly_income || 0) +
    (application?.spouse_income_monthly || 0) +
    (application?.secondary_income_monthly || 0)

  const totalExpenses = (application?.monthly_personal_expenses || 0) +
    (application?.monthly_business_expenses || 0) +
    (application?.monthly_other_obligations || 0)

  const debtToIncomeRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0

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
          href="/advisor/applications"
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/advisor/applications"
            className="text-slate-400 hover:text-slate-300 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {application.client_first_name} {application.client_last_name}
            </h1>
            <p className="text-slate-400">ID: {applicationId}</p>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
            {getStatusLabel(application.status)}
          </span>
          <p className="text-xs text-slate-500 mt-2">
            Creada: {formatDate(application.created_at)}
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
          <p className="text-xs text-slate-400 mb-1">Plazo</p>
          <p className="text-lg font-semibold text-slate-100">{application.requested_months} meses</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">Relación deuda-ingreso</p>
          <p className="text-lg font-semibold text-slate-100">{debtToIncomeRatio}%</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">Información Personal</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-400">Cédula</p>
            <p className="font-medium text-slate-100">{application.client_id_number}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Teléfono</p>
            <p className="font-medium text-slate-100">{application.client_phone}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Email</p>
            <p className="font-medium text-slate-100">{application.client_email}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-slate-400">Dirección</p>
            <p className="font-medium text-slate-100">
              {application.address_street}, {application.address_city}, {application.address_department}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Estado civil</p>
            <p className="font-medium text-slate-100">{application.marital_status}</p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">Información del Negocio</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <p className="text-sm text-slate-400">Nombre del negocio</p>
            <p className="font-medium text-slate-100">{application.business_name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Años operando</p>
            <p className="font-medium text-slate-100">{application.business_years_operating}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Tipo de negocio</p>
            <p className="font-medium text-slate-100">{application.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Sector</p>
            <p className="font-medium text-slate-100">{application.business_sector}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Matrícula</p>
            <p className="font-medium text-slate-100">{application.business_registration}</p>
          </div>
          <div className="md:col-span-3">
            <p className="text-sm text-slate-400">Propósito del crédito</p>
            <p className="font-medium text-slate-100">{application.purpose}</p>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold">Ingresos Mensuales</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-slate-400">Ingreso principal</p>
              <p className="font-medium text-slate-100">{formatCurrency(application.client_monthly_income)}</p>
            </div>
            {application.secondary_income_monthly ? (
              <div className="flex justify-between">
                <p className="text-slate-400">Ingreso secundario</p>
                <p className="font-medium text-slate-100">{formatCurrency(application.secondary_income_monthly)}</p>
              </div>
            ) : null}
            {application.spouse_income_monthly ? (
              <div className="flex justify-between">
                <p className="text-slate-400">Ingreso cónyuge</p>
                <p className="font-medium text-slate-100">{formatCurrency(application.spouse_income_monthly)}</p>
              </div>
            ) : null}
            <div className="pt-2 border-t border-slate-600 flex justify-between">
              <p className="font-semibold text-emerald-400">Total</p>
              <p className="font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-bold">Gastos Mensuales</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-slate-400">Gastos personales</p>
              <p className="font-medium text-slate-100">{formatCurrency(application.monthly_personal_expenses)}</p>
            </div>
            {application.monthly_business_expenses ? (
              <div className="flex justify-between">
                <p className="text-slate-400">Gastos del negocio</p>
                <p className="font-medium text-slate-100">{formatCurrency(application.monthly_business_expenses)}</p>
              </div>
            ) : null}
            {application.monthly_other_obligations ? (
              <div className="flex justify-between">
                <p className="text-slate-400">Otras obligaciones</p>
                <p className="font-medium text-slate-100">{formatCurrency(application.monthly_other_obligations)}</p>
              </div>
            ) : null}
            <div className="pt-2 border-t border-slate-600 flex justify-between">
              <p className="font-semibold text-red-400">Total</p>
              <p className="font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collateral */}
      {(application.collateral_type || application.collateral_value) && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-bold">Garantía</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Tipo de garantía</p>
              <p className="font-medium text-slate-100">{application.collateral_type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Valor de la garantía</p>
              <p className="font-medium text-slate-100">{formatCurrency(application.collateral_value)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end border-t border-slate-700 pt-6">
        <Link
          href="/advisor/applications"
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition"
        >
          Volver
        </Link>

        {application.status === 'draft' && (
          <Link
            href={`/advisor/applications/${applicationId}/edit`}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Link>
        )}

        <Link
          href={`/advisor/applications/${applicationId}/analysis`}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Ver Análisis
        </Link>

        {application.status === 'draft' && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar solicitud
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
