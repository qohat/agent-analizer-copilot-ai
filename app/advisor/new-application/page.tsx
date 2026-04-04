'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { MultiStepForm } from '@/components/MultiStepForm'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

function NewApplicationContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/advisor/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Nueva Solicitud de Crédito
          </h1>
          <p className="text-slate-400">
            Complete el formulario multi-step para registrar la solicitud
          </p>
        </div>

        <MultiStepForm />
      </div>
    </div>
  )
}

export default function NewApplicationPage() {
  return (
    <ProtectedRoute allowedRoles={['advisor', 'admin']}>
      <NewApplicationContent />
    </ProtectedRoute>
  )
}
