import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { extractUserFromRequest, requireAuth, requireRole, requireSameInstitution } from '@/lib/auth'
import { z } from 'zod'

/**
 * Schema for committee decision
 */
const decisionSchema = z.object({
  decision: z.enum(['approved', 'rejected', 'pending_review']),
  notes: z.string().max(1000).optional(),
  approved_amount: z.number().positive().optional(),
  approved_months: z.number().int().min(1).max(120).optional(),
  approved_rate: z.number().min(0).max(100).optional(),
  approved_collateral_type: z.string().optional(),
})

/**
 * PUT /api/applications/[id]/decision
 * Committee members approve or reject applications
 *
 * Only committee members can make decisions
 * Application must be in 'under_review' status
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = extractUserFromRequest(request)
    const authenticatedUser = requireRole(user, ['comite_member', 'admin'])

    const body = await request.json()

    // Validate input
    const validatedData = decisionSchema.parse(body)

    // Get application
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select('id, institution_id, status')
      .eq('id', params.id)
      .single()

    if (appError) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Verify institution access
    requireSameInstitution(user, application.institution_id)

    // Only applications under review or submitted can be decided
    if (!['under_review', 'submitted'].includes(application.status)) {
      return NextResponse.json(
        { error: 'Application is not under review' },
        { status: 400 }
      )
    }

    // If approved, validate required fields
    if (validatedData.decision === 'approved') {
      if (
        validatedData.approved_amount === undefined ||
        validatedData.approved_months === undefined
      ) {
        return NextResponse.json(
          { error: 'approved_amount and approved_months required for approval' },
          { status: 400 }
        )
      }
    }

    // Map decision to status
    const statusMap: Record<string, string> = {
      'approved': 'approved',
      'rejected': 'rejected',
      'pending_review': 'under_review',
    }

    // Update application with decision
    const updatePayload: Record<string, any> = {
      comite_decision: validatedData.decision,
      comite_notes: validatedData.notes || null,
      comite_reviewer_id: authenticatedUser.id,
      comite_reviewed_at: new Date().toISOString(),
      status: statusMap[validatedData.decision],
    }

    // Add approved terms if approved
    if (validatedData.decision === 'approved') {
      updatePayload.approved_amount = validatedData.approved_amount
      updatePayload.approved_months = validatedData.approved_months
      updatePayload.approved_rate = validatedData.approved_rate || null
      updatePayload.approved_collateral_type = validatedData.approved_collateral_type || null
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('applications')
      .update(updatePayload)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating application decision:', updateError)
      return NextResponse.json(
        { error: 'Failed to record decision' },
        { status: 500 }
      )
    }

    // TODO: Send notification to advisor
    // - Email notification
    // - In-app notification
    // - SMS notification (optional)

    return NextResponse.json({
      application_id: updated.id,
      decision: updated.comite_decision,
      status: updated.status,
      reviewed_at: updated.comite_reviewed_at,
      approved_amount: updated.approved_amount,
      approved_months: updated.approved_months,
    })
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

    console.error('Error recording decision:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
