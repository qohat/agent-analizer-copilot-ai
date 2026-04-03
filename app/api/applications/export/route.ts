import { NextResponse } from 'next/server'

/**
 * GET /api/applications/export
 * Export offline data as JSON file
 * Useful for debugging and data recovery
 */
export async function GET() {
  try {
    // TODO: Access IndexedDB from server context (not possible directly)
    // This endpoint should be called from client-side to export data

    // For now, return error guiding user to use client-side export
    return NextResponse.json(
      {
        error: 'Use client-side export',
        message:
          'Data export must be initiated from the browser. Open DevTools console and run: db.exportAllData()',
      },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/applications/export/download
 * Export all offline applications as downloadable CSV
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applications } = body as {
      applications: Array<Record<string, any>>
    }

    if (!Array.isArray(applications)) {
      return NextResponse.json({ error: 'Invalid applications data' }, { status: 400 })
    }

    // Convert to CSV
    const headers = [
      'ID',
      'Nombre Cliente',
      'Monto',
      'Estado',
      'Creado',
      'Modificado',
      'Tipo',
    ]
    const rows = applications.map((app) => [
      app.serverApplicationId || app.id || '',
      app.clientFirstName && app.clientLastName
        ? `${app.clientFirstName} ${app.clientLastName}`
        : '',
      app.requestedAmount || '',
      app.syncStatus || '',
      new Date(app.createdOfflineAt).toLocaleDateString(),
      new Date(app.lastModifiedOfflineAt).toLocaleDateString(),
      app.applicationTypeId || '',
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv;charset=utf-8',
        'Content-Disposition': `attachment; filename="aplicaciones_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
