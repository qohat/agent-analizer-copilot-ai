/**
 * API client with automatic authentication
 *
 * Automatically adds bypass_user from localStorage to API requests
 * This enables server-side auth middleware to identify the user
 */

import { BypassUser } from '@/lib/auth'

/**
 * Get current user from localStorage
 */
export function getBypassUser(): BypassUser | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem('bypass_user')
    if (!stored) return null
    return JSON.parse(stored) as BypassUser
  } catch {
    return null
  }
}

/**
 * Make authenticated API request
 * Automatically adds Authorization header with bypass user
 */
export async function apiCall(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const user = getBypassUser()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  }

  // Add authorization header if user exists
  if (user) {
    headers['Authorization'] = `Bearer ${JSON.stringify(user)}`
    headers['X-Bypass-User'] = JSON.stringify(user)
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Make authenticated GET request
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await apiCall(url, { method: 'GET' })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Make authenticated POST request
 */
export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiCall(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Make authenticated PUT request
 */
export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiCall(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Make authenticated PATCH request
 */
export async function apiPatch<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiCall(url, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Make authenticated DELETE request
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiCall(url, { method: 'DELETE' })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API error: ${response.status}`)
  }

  return response.json()
}
