/**
 * Authentication helpers
 *
 * Uses Supabase Auth with JWT validation
 */

import { supabaseAdmin } from '@/lib/supabase/client'

export interface AuthUser {
  id: string
  email: string
  role: string
  institution_id: string
  name?: string
}

/**
 * Extract and validate user from Supabase JWT token
 */
export async function extractUserFromRequest(request: Request): Promise<AuthUser | null> {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return null
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.replace(/^Bearer\s+/, '')
    if (!token) {
      return null
    }

    // Validate JWT token with Supabase
    const { data: { user: authUser }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !authUser) {
      console.error('Invalid token:', error)
      return null
    }

    // Fetch user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .single()

    if (profileError || !profile) {
      console.error('User profile not found:', profileError)
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      institution_id: profile.institution_id,
      name: profile.name,
    }
  } catch (error) {
    console.error('Error extracting user from request:', error)
    return null
  }
}

/**
 * Require authentication - throws error if user not authenticated
 */
export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    const error = new Error('Unauthorized: No authenticated user found')
    ;(error as any).status = 401
    throw error
  }
  return user
}

/**
 * Check if user has specific role
 */
export function hasRole(user: AuthUser | null, role: string | string[]): boolean {
  if (!user) return false
  const roles = Array.isArray(role) ? role : [role]
  return roles.includes(user.role)
}

/**
 * Require specific role - throws error if user doesn't have role
 */
export function requireRole(user: AuthUser | null, role: string | string[]): AuthUser {
  const user_ = requireAuth(user)
  if (!hasRole(user_, role)) {
    const error = new Error(`Forbidden: Required role(s): ${Array.isArray(role) ? role.join(', ') : role}`)
    ;(error as any).status = 403
    throw error
  }
  return user_
}

/**
 * Require same institution - throws error if user is not from same institution
 */
export function requireSameInstitution(user: AuthUser | null, institutionId: string): void {
  const user_ = requireAuth(user)
  if (user_.role !== 'admin' && user_.institution_id !== institutionId) {
    const error = new Error('Forbidden: Access to this institution is not allowed')
    ;(error as any).status = 403
    throw error
  }
}
