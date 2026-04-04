/**
 * Seed Users Script
 *
 * Creates test users in Supabase Auth and users table
 * Run with: npm run seed:users
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const TEST_USERS = [
  {
    email: 'advisor@test.com',
    password: 'password123',
    name: 'Test Advisor',
    role: 'advisor',
  },
  {
    email: 'comite@test.com',
    password: 'password123',
    name: 'Test Comité',
    role: 'comite_member',
  },
  {
    email: 'admin@test.com',
    password: 'password123',
    name: 'Test Admin',
    role: 'admin',
  },
]

async function seedUsers() {
  console.log('🌱 Seeding test users...\n')

  // First, ensure dev institution exists or get one
  let institutionId: string

  // Try to find existing dev institution by name
  const { data: institutions } = await supabase
    .from('institutions')
    .select('id, name')
    .eq('name', 'Development Institution')
    .limit(1)

  if (institutions && institutions.length > 0) {
    institutionId = institutions[0].id
    console.log(`✅ Using existing institution: ${institutionId}\n`)
  } else {
    // Create new institution
    console.log('📦 Creating dev institution...')
    const { data: newInst, error } = await supabase
      .from('institutions')
      .insert({
        name: 'Development Institution',
        country: 'CO',
        max_commercial_amount: 50000000,
        max_agricultural_amount: 100000000,
        min_monthly_income: 800000,
        default_rate: 0.025,
        default_months: 12,
      })
      .select()
      .single()

    if (error || !newInst) {
      console.error('❌ Failed to create institution:', error)
      return
    }

    institutionId = newInst.id
    console.log(`✅ Institution created: ${institutionId}\n`)
  }

  for (const testUser of TEST_USERS) {
    console.log(`👤 Processing ${testUser.email}...`)

    try {
      // Check if user already exists in auth.users
      const { data: existingAuthUser } = await supabase.auth.admin.listUsers()
      const authUserExists = existingAuthUser?.users?.some((u) => u.email === testUser.email)

      let authId: string

      if (authUserExists) {
        console.log(`   ℹ️  Auth user already exists`)
        const existingUser = existingAuthUser?.users?.find((u) => u.email === testUser.email)
        authId = existingUser!.id
      } else {
        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
        })

        if (authError) {
          console.error(`   ❌ Failed to create auth user:`, authError.message)
          continue
        }

        authId = authData.user.id
        console.log(`   ✅ Auth user created (${authId})`)
      }

      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authId)
        .single()

      if (existingUser) {
        console.log(`   ℹ️  User profile already exists`)
      } else {
        // Create user in users table
        const { error: userError } = await supabase.from('users').insert({
          auth_id: authId,
          email: testUser.email,
          name: testUser.name,
          role: testUser.role,
          institution_id: institutionId,
          status: 'active',
        })

        if (userError) {
          console.error(`   ❌ Failed to create user profile:`, userError.message)
          continue
        }

        console.log(`   ✅ User profile created`)
      }

      console.log(`   ✨ ${testUser.email} is ready!\n`)
    } catch (error) {
      console.error(`   ❌ Error:`, error)
      console.log()
    }
  }

  console.log('🎉 Seeding complete!\n')
  console.log('📝 Test credentials:')
  TEST_USERS.forEach((u) => {
    console.log(`   ${u.email} / ${u.password} (${u.role})`)
  })
}

seedUsers().catch(console.error)
