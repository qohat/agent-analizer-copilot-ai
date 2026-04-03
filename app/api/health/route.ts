import { NextResponse } from 'next/server'

/**
 * GET /api/health
 * Simple health check endpoint for connectivity verification
 * Used by useOnlineStatus hook to detect actual connectivity
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  )
}

/**
 * HEAD /api/health
 * Lightweight health check (no response body)
 */
export async function HEAD() {
  return new NextResponse(null, { status: 204 })
}
