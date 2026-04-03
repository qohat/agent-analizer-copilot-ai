import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { extractUserFromRequest, requireAuth, requireSameInstitution } from '@/lib/auth'

/**
 * GET /api/applications/[id]/analysis
 * Get analysis results for an application
 *
 * Returns:
 * - application: The application details
 * - analysis_results: All analysis results for this application (ordered by date DESC)
 * - latest_analysis: The most recent analysis result (if exists)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    // Get application
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single()

    if (appError) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Access control
    if (authenticatedUser.role !== 'admin') {
      requireSameInstitution(user, application.institution_id)

      if (authenticatedUser.role === 'advisor' && application.advisor_id !== authenticatedUser.id) {
        return NextResponse.json(
          { error: 'Not authorized to view this application' },
          { status: 403 }
        )
      }
    }

    // Get all analysis results for this application
    const { data: analysisResults, error: analysisError } = await supabaseAdmin
      .from('analysis_results')
      .select('*')
      .eq('application_id', params.id)
      .order('created_at', { ascending: false })

    if (analysisError) {
      console.error('Error fetching analysis results:', analysisError)
      return NextResponse.json(
        { error: 'Failed to fetch analysis results' },
        { status: 500 }
      )
    }

    const latestAnalysis = analysisResults && analysisResults.length > 0 ? analysisResults[0] : null

    return NextResponse.json({
      application_id: application.id,
      application_status: application.status,
      application_type: application.application_type,
      analysis_results: analysisResults || [],
      latest_analysis: latestAnalysis,
      analysis_count: analysisResults?.length || 0,
      ai_risk_level: application.ai_risk_level,
      ai_recommendation: application.ai_recommendation,
      ai_analysis_at: application.ai_analysis_at,
    })
  } catch (error) {
    if ((error as any).status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as any).status === 403) {
      return NextResponse.json({ error: (error as Error).message }, { status: 403 })
    }

    console.error('Error fetching analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
