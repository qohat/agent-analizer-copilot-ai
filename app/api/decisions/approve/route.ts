import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

/**
 * POST /api/decisions/approve
 * Approve application and auto-generate credit
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applicationId, notes } = body

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Missing applicationId' },
        { status: 400 }
      )
    }

    // TODO: Extract auth user and verify role == 'comite_member'
    const reviewerId = 'placeholder-reviewer-id'

    // Get application
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    if (application.status !== 'submitted' && application.status !== 'under_review') {
      return NextResponse.json(
        { error: 'Application is not ready for approval' },
        { status: 400 }
      )
    }

    // Update application with approval
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        comite_decision: 'approved',
        comite_reviewer_id: reviewerId,
        comite_reviewed_at: new Date().toISOString(),
        comite_notes: notes,
        status: 'approved',
      })
      .eq('id', applicationId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Auto-generate credit
    try {
      const creditMonthlyPayment = application.requested_amount / application.requested_months

      // Get institution to fetch default rate
      const { data: institution } = await supabaseAdmin
        .from('institutions')
        .select('default_rate')
        .eq('id', application.institution_id)
        .single()

      const rate = institution?.default_rate || 2.5

      const today = new Date()
      const startDate = new Date(today)
      startDate.setDate(startDate.getDate() + 7) // Credit starts in 7 days

      const maturityDate = new Date(startDate)
      maturityDate.setMonth(maturityDate.getMonth() + application.requested_months)

      // Create credit
      const { data: credit, error: creditError } = await supabaseAdmin
        .from('credits')
        .insert({
          institution_id: application.institution_id,
          application_id: applicationId,
          client_id: application.client_id,
          principal_amount: application.requested_amount,
          interest_rate: rate,
          monthly_payment: creditMonthlyPayment,
          total_months: application.requested_months,
          disbursement_date: today.toISOString().split('T')[0],
          start_date: startDate.toISOString().split('T')[0],
          maturity_date: maturityDate.toISOString().split('T')[0],
          status: 'active',
        })
        .select()
        .single()

      if (creditError) {
        console.error('Error generating credit:', creditError)
      } else {
        // Link credit to application
        await supabaseAdmin
          .from('applications')
          .update({
            credit_id: credit.id,
            status: 'generated',
          })
          .eq('id', applicationId)

        // Create notification for advisor
        await supabaseAdmin.from('notifications').insert({
          user_id: application.advisor_id,
          type: 'application_approved',
          application_id: applicationId,
          message: `Solicitud ${applicationId} ha sido aprobada. Crédito generado.`,
        })
      }
    } catch (creditError) {
      console.error('Error in credit generation:', creditError)
      // Don't fail the approval, credit can be generated manually
    }

    return NextResponse.json({
      status: 'approved',
      comite_reviewed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error approving application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
