'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo inválido'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Teléfono inválido'),
  institution: z.string().min(1, 'Selecciona una institución'),
  role: z.enum(['advisor', 'comite'], { errorMap: () => ({ message: 'Selecciona un rol' }) }),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    try {
      // TODO: Implement Supabase signup
      // await supabase.auth.signUp({ email: data.email, password: generatePassword() })
      // await supabase.from('users').insert({ email, name, phone, institution_id, role })

      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-4 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-300">Cuenta creada. Revisa tu correo para confirmar.</p>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-400">COPILOTO</h1>
          <p className="text-slate-400">Crea tu cuenta de asesor</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Nombre completo *
            </label>
            <input
              type="text"
              placeholder="Juan Pérez"
              {...register('name')}
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Correo electrónico *
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              {...register('email')}
              disabled={loading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Teléfono *
            </label>
            <input
              type="tel"
              placeholder="+573001234567"
              {...register('phone')}
              disabled={loading}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-400">{errors.phone.message}</p>
            )}
          </div>

          {/* Institution */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Institución *
            </label>
            <select
              {...register('institution')}
              disabled={loading}
              className={errors.institution ? 'border-red-500' : ''}
            >
              <option value="">Selecciona tu institución</option>
              <option value="fincomun">FinComún</option>
              <option value="banco-agrario">Banco Agrario</option>
              <option value="finca">FINCA Colombia</option>
              <option value="otro">Otra</option>
            </select>
            {errors.institution && (
              <p className="text-sm text-red-400">{errors.institution.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Rol *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="advisor"
                  {...register('role')}
                  disabled={loading}
                />
                <span className="text-sm">Asesor de crédito</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="comite"
                  {...register('role')}
                  disabled={loading}
                />
                <span className="text-sm">Comité de crédito</span>
              </label>
            </div>
            {errors.role && (
              <p className="text-sm text-red-400">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full px-4 py-3 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300">
            Ingresa aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
