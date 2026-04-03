'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // BYPASS TEMPORAL - Solo desarrollo (remover en producción)
      if (process.env.NODE_ENV === 'development') {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 800))

        // Create bypass user
        const bypassUser = {
          id: '37f9122b-68ef-4381-a2d8-08debbdebf61',
          email: email,
          role: 'advisor',
          institution_id: '37f9122b-68ef-4381-a2d8-08debbdebf6d'
        }

        // Guardar usuario en localStorage
        localStorage.setItem('bypass_user', JSON.stringify(bypassUser))

        // Also set as cookie for server-side access (optional)
        document.cookie = `bypass_user=${encodeURIComponent(JSON.stringify(bypassUser))}; path=/; max-age=86400`

        // Redirigir al dashboard
        window.location.href = '/advisor/dashboard'
        return
      }

      // TODO: Producción - Implement Supabase magic link login
      // const { error } = await supabase.auth.signInWithOtp({ email })
      // if (error) throw error

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar enlace de login')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 rounded-full">
            <Mail className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Revisa tu correo</h2>
          <p className="text-slate-400">
            Enviamos un enlace de login a <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
          Si no lo ves en unos minutos, revisa spam. El enlace expira en 24 horas.
        </div>

        <button
          onClick={() => setSent(false)}
          className="w-full text-center text-slate-400 hover:text-slate-300 text-sm"
        >
          ¿Usaste otro correo? Intenta de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-emerald-400">COPILOTO</h1>
        <p className="text-slate-400">Ingresa con tu correo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            className="w-full"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar enlace de login'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-400">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
