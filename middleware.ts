import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to check authentication for protected routes
 *
 * For now, this is a simple check. In production, this should:
 * 1. Validate JWT tokens from Supabase
 * 2. Check RLS policies on database queries
 * 3. Implement token refresh logic
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Protected routes that require authentication
  const protectedPaths = ['/advisor', '/comite', '/admin']
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedRoute) {
    // Check if bypass_user exists in cookies (server-side validation)
    // In development: check for bypass_user cookie or header
    // In production: validate JWT token

    const bypassUserCookie = request.cookies.get('bypass_user')
    const bypassUserHeader = request.headers.get('X-Bypass-User')

    // For development, if neither exists, redirect to login
    if (!bypassUserCookie && !bypassUserHeader) {
      // Only redirect if we're in development and it's not an API route
      if (!pathname.startsWith('/api')) {
        const loginUrl = new URL('/auth/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
  }

  return NextResponse.next()
}

/**
 * Configure which paths the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (login, signup)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
