import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { applicationCreateSchema } from '@/lib/validation/schemas'
import { extractUserFromRequest, requireAuth, hasRole } from '@/lib/auth'
import { z } from 'zod'

/**
 * GET /api/applications
 * List applications for authenticated user
 *
 * Advisors see only their own applications
 * Committee members see all applications in their institution
 * Admins see all applications
 */
export async function GET(request: Request) {
  try {
    const user = extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Max 100

    let query = supabaseAdmin.from('applications').select('*', { count: 'exact' })

    // Filter by institution for all non-admin users
    if (authenticatedUser.role !== 'admin') {
      query = query.eq('institution_id', authenticatedUser.institution_id)
    }

    // Advisors see only their own applications
    if (authenticatedUser.role === 'advisor') {
      query = query.eq('advisor_id', authenticatedUser.id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications: data, total: count || 0 })
  } catch (error) {
    if ((error as any).status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/applications
 * Create new application (draft)
 * Requires authenticated advisor user
 */
export async function POST(request: Request) {
  try {
    const user = extractUserFromRequest(request)
    const authenticatedUser = requireAuth(user)

    // Only advisors can create applications
    if (authenticatedUser.role !== 'advisor' && authenticatedUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only advisors can create applications' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = applicationCreateSchema.parse(body)

    const advisorId = authenticatedUser.id
    const institutionId = authenticatedUser.institution_id

    // Create primary client
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        institution_id: institutionId,
        first_name: validatedData.clientFirstName,
        last_name: validatedData.clientLastName,
        id_number: validatedData.clientIdNumber,
        id_type: validatedData.clientIdType,
        date_of_birth: validatedData.clientDateOfBirth,
        phone: validatedData.clientPhone,
        email: validatedData.clientEmail,
        address_street: validatedData.addressStreet,
        address_city: validatedData.addressCity,
        address_department: validatedData.addressDepartment,
        marital_status: validatedData.maritalStatus,
      })
      .select()
      .single()

    if (clientError) {
      console.error('Error creating client:', clientError)
      return NextResponse.json({ error: 'Failed to create client' }, { status: 500 })
    }

    let spouseId: string | null = null
    let coapplicantId: string | null = null

    // Create spouse client if provided
    if (validatedData.hasSpouse && validatedData.spouseFirstName && validatedData.spouseLastName) {
      const { data: spouse, error: spouseError } = await supabaseAdmin
        .from('clients')
        .insert({
          institution_id: institutionId,
          first_name: validatedData.spouseFirstName,
          last_name: validatedData.spouseLastName,
          id_number: validatedData.spouseIdNumber || '',
          id_type: validatedData.spouseIdType || 'cedula',
          date_of_birth: validatedData.spouseDateOfBirth,
          phone: validatedData.spousePhone,
          email: validatedData.spouseEmail,
        })
        .select()
        .single()

      if (spouseError) {
        console.error('Error creating spouse:', spouseError)
        // Don't fail, continue without spouse
      } else {
        spouseId = spouse.id
      }
    }

    // Create application with mapped fields
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .insert({
        institution_id: institutionId,
        advisor_id: advisorId,
        client_id: client.id,
        spouse_id: spouseId,
        coapplicant_id: coapplicantId,
        application_type: validatedData.productType,
        requested_amount: validatedData.requestedAmount,
        requested_months: validatedData.loanTermMonths,
        purpose: validatedData.businessDescription,
        business_name: validatedData.businessName,
        business_type: validatedData.businessLegalForm,
        business_years_operating: validatedData.businessYearsOperating,
        business_monthly_sales: 0, // Placeholder, not in schema
        client_monthly_income: validatedData.primaryIncomeMonthly,
        spouse_monthly_income: validatedData.spouseIncomeMonthly,
        coapplicant_monthly_income: validatedData.coapplicantIncomeMonthly,
        other_monthly_income: validatedData.secondaryIncomeMonthly,
        monthly_personal_expenses: validatedData.householdExpensesMonthly,
        monthly_business_expenses: validatedData.businessExpensesMonthly,
        monthly_other_obligations: validatedData.debtObligationsMonthly,
        status: 'draft',
      })
      .select()
      .single()

    if (appError) {
      console.error('Error creating application:', appError)
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        application_id: application.id,
        status: application.status,
        created_at: application.created_at,
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

    console.error('Error creating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
