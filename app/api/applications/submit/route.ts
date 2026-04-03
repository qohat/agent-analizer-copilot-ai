import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { extractUserFromRequest, requireAuth, requireSameInstitution } from '@/lib/auth'
import { analyzeCommercialCredit, analyzeAgriculturalCredit } from '@/lib/ai/credit-analyzer'

/**
 * POST /api/applications/submit
 * Submit application for review and trigger IA analysis
 *
 * Only advisors who own the application can submit
 * Application must be in draft status
 */
export async function POST(request: Request) {
  try {
    const user = extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    const body = await request.json()
    const { applicationId } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Missing applicationId' },
        { status: 400 }
      )
    }

    // Get application details
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Access control
    if (authenticatedUser.role !== 'admin') {
      requireSameInstitution(user, application.institution_id)

      if (authenticatedUser.role === 'advisor' && application.advisor_id !== authenticatedUser.id) {
        return NextResponse.json(
          { error: 'Not authorized to submit this application' },
          { status: 403 }
        )
      }
    }

    if (application.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft applications can be submitted' },
        { status: 400 }
      )
    }

    // Mark as submitted
    const { error: submitError } = await supabaseAdmin
      .from('applications')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (submitError) {
      return NextResponse.json({ error: submitError.message }, { status: 500 })
    }

    // Run IA analysis asynchronously
    try {
      const analysisParams = {
        clientMonthlyIncome: application.client_monthly_income,
        spouseMonthlyIncome: application.spouse_monthly_income,
        coapplicantMonthlyIncome: application.coapplicant_monthly_income,
        otherMonthlyIncome: application.other_monthly_income,
        monthlyPersonalExpenses: application.monthly_personal_expenses,
        monthlyBusinessExpenses: application.monthly_business_expenses,
        monthlyOtherObligations: application.monthly_other_obligations,
        requestedAmount: application.requested_amount,
        requestedMonths: application.requested_months,
        businessType: application.business_type,
        businessSector: application.business_sector,
        businessYearsOperating: application.business_years_operating,
        businessMonthlySales: application.business_monthly_sales,
      }

      let analysis
      if (application.application_type === 'commercial') {
        analysis = await analyzeCommercialCredit(analysisParams)
      } else {
        analysis = await analyzeAgriculturalCredit(analysisParams)
      }

      // Store analysis results
      const { error: analysisError } = await supabaseAdmin
        .from('analysis_results')
        .insert({
          application_id: applicationId,
          analysis_type: application.application_type,
          gross_income:
            (application.client_monthly_income || 0) +
            (application.spouse_monthly_income || 0) +
            (application.coapplicant_monthly_income || 0),
          total_expenses:
            (application.monthly_personal_expenses || 0) +
            (application.monthly_business_expenses || 0) +
            (application.monthly_other_obligations || 0),
          debt_to_income_ratio: analysis.debt_to_income_ratio,
          payment_capacity_percent: analysis.payment_capacity_percent,
          risk_level: analysis.risk_level,
          risk_factors: analysis.risk_factors,
          recommendation: analysis.recommendation,
          confidence_score: analysis.confidence_score,
          model_version: 'claude-3-5-sonnet-20241022',
          prompt_version: '1.0',
          raw_response: analysis,
        })

      if (analysisError) {
        console.error('Error storing analysis:', analysisError)
      } else {
        // Update application with analysis results
        await supabaseAdmin
          .from('applications')
          .update({
            ai_risk_level: analysis.risk_level,
            ai_debt_to_income_ratio: analysis.debt_to_income_ratio,
            ai_payment_capacity_percent: analysis.payment_capacity_percent,
            ai_recommendation: analysis.recommendation,
            ai_analysis_at: new Date().toISOString(),
            ai_analysis_version: 'claude-3-5-sonnet-20241022',
            status: 'under_review',
          })
          .eq('id', applicationId)
      }
    } catch (analysisError) {
      console.error('Error running analysis:', analysisError)
      // Don't fail the request, analysis can be retried
    }

    return NextResponse.json({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
  } catch (error) {
    if ((error as any).status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as any).status === 403) {
      return NextResponse.json({ error: (error as Error).message }, { status: 403 })
    }
    console.error('Error submitting application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
