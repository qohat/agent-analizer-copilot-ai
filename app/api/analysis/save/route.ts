import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { extractUserFromRequest, requireAuth, requireSameInstitution } from '@/lib/auth'
import { z } from 'zod'

/**
 * Schema for analysis results
 */
const analysisSaveSchema = z.object({
  application_id: z.string().uuid('Invalid application ID'),
  analysis_type: z.enum(['commercial', 'agricultural']),
  gross_income: z.number().nonnegative(),
  total_expenses: z.number().nonnegative(),
  net_income: z.number(),
  debt_to_income_ratio: z.number().min(0).max(1),
  payment_capacity_percent: z.number().min(0).max(100),
  risk_level: z.enum(['low', 'medium', 'high', 'critical']),
  risk_factors: z.array(z.string()),
  recommendation: z.enum(['approve', 'review', 'reject']),
  confidence_score: z.number().min(0).max(1),
  raw_response: z.record(z.any()).optional(),
})

/**
 * POST /api/analysis/save
 * Persist Claude analysis results to database
 *
 * Only committee members and advisors can save analysis
 */
export async function POST(request: Request) {
  try {
    const user = extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    // Only advisors and committee members can save analysis
    if (!['advisor', 'comite_member', 'admin'].includes(authenticatedUser.role)) {
      return NextResponse.json(
        { error: 'Not authorized to save analysis' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = analysisSaveSchema.parse(body)

    // Get application to verify access and institution
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, institution_id, advisor_id')
      .eq('id', validatedData.application_id)
      .single()

    if (appError) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Verify institution access
    requireSameInstitution(user, application.institution_id)

    // Verify advisor access (if advisor, can only analyze own applications)
    if (
      authenticatedUser.role === 'advisor' &&
      application.advisor_id !== authenticatedUser.id
    ) {
      return NextResponse.json(
        { error: 'Not authorized to analyze this application' },
        { status: 403 }
      )
    }

    // Insert analysis results
    const { data: analysis, error: analysisError } = await supabaseAdmin
      .from('analysis_results')
      .insert({
        application_id: validatedData.application_id,
        analysis_type: validatedData.analysis_type,
        gross_income: validatedData.gross_income,
        total_expenses: validatedData.total_expenses,
        net_income: validatedData.net_income,
        debt_to_income_ratio: validatedData.debt_to_income_ratio,
        payment_capacity_percent: validatedData.payment_capacity_percent,
        risk_level: validatedData.risk_level,
        risk_factors: validatedData.risk_factors,
        recommendation: validatedData.recommendation,
        confidence_score: validatedData.confidence_score,
        raw_response: validatedData.raw_response || {},
        model_version: 'claude-3-5-sonnet-20241022',
        prompt_version: '1.0',
      })
      .select()
      .single()

    if (analysisError) {
      console.error('Error storing analysis:', analysisError)
      return NextResponse.json(
        { error: 'Failed to store analysis results' },
        { status: 500 }
      )
    }

    // Update application with latest analysis results
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        ai_risk_level: validatedData.risk_level,
        ai_debt_to_income_ratio: validatedData.debt_to_income_ratio,
        ai_payment_capacity_percent: validatedData.payment_capacity_percent,
        ai_recommendation: validatedData.recommendation,
        ai_analysis_at: new Date().toISOString(),
        ai_analysis_version: 'claude-3-5-sonnet-20241022',
      })
      .eq('id', validatedData.application_id)

    if (updateError) {
      console.error('Error updating application with analysis:', updateError)
      // Don't fail the request, analysis was saved
    }

    return NextResponse.json(
      {
        analysis_id: analysis.id,
        application_id: validatedData.application_id,
        risk_level: validatedData.risk_level,
        recommendation: validatedData.recommendation,
        created_at: analysis.created_at,
      },
      { status: 201 }
    )
  } catch (error) {
    if ((error as any).status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as any).status === 403) {
      return NextResponse.json({ error: (error as Error).message }, { status: 403 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error saving analysis:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
