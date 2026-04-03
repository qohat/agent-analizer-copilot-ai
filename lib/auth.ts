/**
 * Authentication helpers
 *
 * Bypass authentication for development (stores user in localStorage)
 * For production, replace with Supabase JWT validation
 */

export interface BypassUser {
  id: string
  email: string
  role: 'advisor' | 'comite_member' | 'admin'
  institution_id: string
}

/**
 * Extract bypass user from request headers or cookies
 * Development: reads from Authorization header (set by client)
 * Production: should validate JWT token instead
 */
export function extractUserFromRequest(request: Request): BypassUser | null {
  try {
    // Check Authorization header for bypass user (development mode)
    const authHeader = request.headers.get('Authorization') || request.headers.get('X-Bypass-User')

    if (authHeader) {
      try {
        // Header format: "Bearer {json}" or just "{json}"
        const jsonStr = authHeader.replace(/^Bearer\s+/, '')
        const user = JSON.parse(jsonStr)

        // Validate required fields
        if (user.id && user.email && user.role && user.institution_id) {
          return user as BypassUser
        }
      } catch {
        // Invalid JSON, continue
      }
    }

    // Check cookies (if set by client)
    const cookieHeader = request.headers.get('Cookie')
    if (cookieHeader) {
      const bypassUserCookie = cookieHeader
        .split(';')
        .find(c => c.trim().startsWith('bypass_user='))

      if (bypassUserCookie) {
        try {
          const jsonStr = decodeURIComponent(bypassUserCookie.split('=')[1])
          const user = JSON.parse(jsonStr)

          if (user.id && user.email && user.role && user.institution_id) {
            return user as BypassUser
          }
        } catch {
          // Invalid cookie, continue
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error extracting user from request:', error)
    return null
  }
}

/**
 * Require authentication - throws error if user not authenticated
 */
export function requireAuth(user: BypassUser | null): BypassUser {
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
export function hasRole(user: BypassUser | null, role: string | string[]): boolean {
  if (!user) return false
  const roles = Array.isArray(role) ? role : [role]
  return roles.includes(user.role)
}

/**
 * Require specific role - throws error if user doesn't have role
 */
export function requireRole(user: BypassUser | null, role: string | string[]): BypassUser {
  const user_ = requireAuth(user)
  if (!hasRole(user_, role)) {
    const error = new Error(`Forbidden: Required role(s): ${Array.isArray(role) ? role.join(', ') : role}`)
    ;(error as any).status = 403
    throw error
  }
  return user_
}

/**
 * Require same institution - throws error if user is from different institution
 */
export function requireSameInstitution(user: BypassUser | null, institutionId: string): BypassUser {
  const user_ = requireAuth(user)
  if (user_.institution_id !== institutionId) {
    const error = new Error('Forbidden: Not authorized to access this institution')
    ;(error as any).status = 403
    throw error
  }
  return user_
}
