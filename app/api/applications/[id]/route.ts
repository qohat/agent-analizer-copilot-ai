import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { applicationUpdateSchema } from '@/lib/validation/schemas'
import { extractUserFromRequest, requireAuth, requireSameInstitution } from '@/lib/auth'
import { z } from 'zod'

/**
 * GET /api/applications/[id]
 * Get single application with all details
 *
 * Access control:
 * - Advisors can only see their own applications
 * - Committee members can see any application in their institution
 * - Admins can see all applications
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select(
        `
        *,
        client:clients(*),
        spouse:clients(*)
      `
      )
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
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

    return NextResponse.json(application)
  } catch (error) {
    if ((error as any).status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as any).status === 403) {
      return NextResponse.json({ error: (error as Error).message }, { status: 403 })
    }
    console.error('Error fetching application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/applications/[id]
 * Update application (only if draft status)
 *
 * Only advisors who own the application can update it
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    const body = await request.json()

    // Validate input (partial schema for updates)
    const validatedData = applicationUpdateSchema.parse(body)

    // Get current application
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('status, advisor_id, institution_id')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Access control
    if (authenticatedUser.role !== 'admin') {
      requireSameInstitution(user, current.institution_id)

      if (authenticatedUser.role === 'advisor' && current.advisor_id !== authenticatedUser.id) {
        return NextResponse.json(
          { error: 'Not authorized to update this application' },
          { status: 403 }
        )
      }
    }

    // Only allow updates if draft
    if (current.status !== 'draft') {
      return NextResponse.json(
        { error: 'Can only update draft applications' },
        { status: 400 }
      )
    }

    // Build update payload (filter out undefined values)
    const updatePayload: Record<string, any> = {}
    const fieldMap: Record<string, string> = {
      clientFirstName: 'client_first_name',
      clientLastName: 'client_last_name',
      businessName: 'business_name',
      businessSector: 'business_sector',
      requestedAmount: 'requested_amount',
      requestedMonths: 'requested_months',
      clientMonthlyIncome: 'client_monthly_income',
      monthlyPersonalExpenses: 'monthly_personal_expenses',
      monthlyBusinessExpenses: 'monthly_business_expenses',
    }

    Object.entries(fieldMap).forEach(([key, dbField]) => {
      if (validatedData[key as keyof typeof validatedData] !== undefined) {
        updatePayload[dbField] = validatedData[key as keyof typeof validatedData]
      }
    })

    updatePayload.updated_at = new Date().toISOString()

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('applications')
      .update(updatePayload)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      id: updated.id,
      updated_at: updated.updated_at,
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

    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PATCH /api/applications/[id]
 * Partial update application (alias for PUT)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return PUT(request, { params })
}

/**
 * DELETE /api/applications/[id]
 * Delete a draft application
 *
 * Only advisors who own the application can delete it
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    const applicationId = params.id

    // Check if application exists and is draft
    const { data: app, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('status, advisor_id, institution_id')
      .eq('id', applicationId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Access control
    if (authenticatedUser.role !== 'admin') {
      requireSameInstitution(user, app.institution_id)

      if (authenticatedUser.role === 'advisor' && app.advisor_id !== authenticatedUser.id) {
        return NextResponse.json(
          { error: 'Not authorized to delete this application' },
          { status: 403 }
        )
      }
    }

    if (app.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft applications can be deleted' },
        { status: 400 }
      )
    }

    // Delete application
    const { error: deleteError } = await supabaseAdmin
      .from('applications')
      .delete()
      .eq('id', applicationId)

    if (deleteError) {
      console.error('Error deleting application:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as any).status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if ((error as any).status === 403) {
      return NextResponse.json({ error: (error as Error).message }, { status: 403 })
    }
    console.error('Error deleting application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
