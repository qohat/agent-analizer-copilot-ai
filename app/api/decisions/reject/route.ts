import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

/**
 * POST /api/decisions/reject
 * Reject application and notify advisor
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { applicationId, reason, notes } = body

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
        { error: 'Application is not ready for decision' },
        { status: 400 }
      )
    }

    // Update application with rejection
    const fullNotes = [reason, notes].filter(Boolean).join(' - ')

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        comite_decision: 'rejected',
        comite_reviewer_id: reviewerId,
        comite_reviewed_at: new Date().toISOString(),
        comite_notes: fullNotes,
        status: 'rejected',
      })
      .eq('id', applicationId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Create notification for advisor
    try {
      await supabaseAdmin.from('notifications').insert({
        user_id: application.advisor_id,
        type: 'application_rejected',
        application_id: applicationId,
        message: `Solicitud ${applicationId} ha sido rechazada. Razón: ${reason}`,
      })
    } catch (notifError) {
      console.error('Error creating notification:', notifError)
    }

    return NextResponse.json({
      status: 'rejected',
      comite_reviewed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error rejecting application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
