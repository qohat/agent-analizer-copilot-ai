'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'advisor' | 'comite_member' | 'admin'>
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated
      if (!user) {
        router.push(`/login?redirect=${pathname}`)
        return
      }

      // Not authorized (wrong role)
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, isLoading, router, pathname, allowedRoles])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return null // Will redirect
  }

  // Not authorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null // Will redirect
  }

  // Authenticated and authorized
  return <>{children}</>
}
