-- Copiloto de Crédito - Database Schema Initialization
-- Date: 2026-03-30
-- Version: 1.0

-- ============================================================================
-- INSTITUTIONS (Multi-tenant config)
-- ============================================================================

CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  logo_url TEXT,

  -- Credit product configuration
  max_commercial_amount DECIMAL(15,2),
  max_agricultural_amount DECIMAL(15,2),
  min_monthly_income DECIMAL(10,2),
  default_rate DECIMAL(5,2),
  default_months INTEGER DEFAULT 24,

  -- Risk rules
  debt_to_income_threshold DECIMAL(3,2) DEFAULT 0.40,
  debt_to_income_warning DECIMAL(3,2) DEFAULT 0.30,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_institutions_country ON institutions(country);

-- ============================================================================
-- USERS (Advisors, Comité members, Admin)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,

  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,

  role TEXT NOT NULL,
  region TEXT,

  phone TEXT,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,

  can_approve_until DECIMAL(15,2),

  status TEXT DEFAULT 'active',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager ON users(manager_id);

-- ============================================================================
-- CLIENTS (People applying for credit)
-- ============================================================================

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  id_type TEXT NOT NULL,
  date_of_birth DATE,
  phone TEXT,
  email TEXT,

  address_street TEXT,
  address_city TEXT,
  address_department TEXT,
  address_postal_code TEXT,

  marital_status TEXT,
  dependents_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(institution_id, id_number, id_type)
);

CREATE INDEX idx_clients_institution ON clients(institution_id);
CREATE INDEX idx_clients_id_number ON clients(id_number);
CREATE INDEX idx_clients_name ON clients(first_name, last_name);

-- ============================================================================
-- CREDIT APPLICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  spouse_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  coapplicant_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  application_type TEXT NOT NULL,
  requested_amount DECIMAL(15,2) NOT NULL,
  requested_months INTEGER NOT NULL,
  purpose TEXT,

  business_name TEXT,
  business_type TEXT,
  business_sector TEXT,
  business_years_operating INTEGER,
  business_monthly_sales DECIMAL(15,2),

  client_monthly_income DECIMAL(15,2) NOT NULL,
  spouse_monthly_income DECIMAL(15,2),
  coapplicant_monthly_income DECIMAL(15,2),
  other_monthly_income DECIMAL(15,2),

  monthly_personal_expenses DECIMAL(15,2),
  monthly_business_expenses DECIMAL(15,2),
  monthly_other_obligations DECIMAL(15,2),

  status TEXT DEFAULT 'draft',

  ai_risk_level TEXT,
  ai_debt_to_income_ratio DECIMAL(5,4),
  ai_payment_capacity_percent DECIMAL(5,2),
  ai_recommendation TEXT,
  ai_analysis_at TIMESTAMPTZ,
  ai_analysis_version TEXT,

  comite_decision TEXT,
  comite_reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  comite_reviewed_at TIMESTAMPTZ,
  comite_notes TEXT,

  credit_id UUID,

  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  offline_sync_id TEXT UNIQUE,
  last_synced_at TIMESTAMPTZ
);

CREATE INDEX idx_applications_institution ON applications(institution_id);
CREATE INDEX idx_applications_advisor ON applications(advisor_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_comite_decision ON applications(comite_decision);
CREATE INDEX idx_applications_client ON applications(client_id);

-- ============================================================================
-- ANALYSIS RESULTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  analysis_type TEXT NOT NULL,

  gross_income DECIMAL(15,2),
  total_expenses DECIMAL(15,2),
  net_income DECIMAL(15,2),
  debt_to_income_ratio DECIMAL(5,4),
  payment_capacity_percent DECIMAL(5,2),

  risk_level TEXT,
  risk_factors TEXT[],

  recommendation TEXT,
  confidence_score DECIMAL(3,2),

  model_version TEXT,
  prompt_version TEXT,
  raw_response JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_results_application ON analysis_results(application_id);
CREATE INDEX idx_analysis_results_risk_level ON analysis_results(risk_level);

-- ============================================================================
-- CREDITS (Generated after approval)
-- ============================================================================

CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,

  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,

  principal_amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(15,2) NOT NULL,
  total_months INTEGER NOT NULL,

  disbursement_date DATE,
  start_date DATE,
  maturity_date DATE,

  status TEXT DEFAULT 'active',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credits_institution ON credits(institution_id);
CREATE INDEX idx_credits_client ON credits(client_id);
CREATE INDEX idx_credits_status ON credits(status);

-- ============================================================================
-- SYNC QUEUE (For offline sync tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,

  operation TEXT NOT NULL,
  entity_type TEXT NOT NULL,

  payload JSONB NOT NULL,

  status TEXT DEFAULT 'pending',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(status);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,

  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Applications: Advisors can read/write their own
CREATE POLICY "Advisors can read own applications"
  ON applications FOR SELECT
  USING (advisor_id = auth.uid() OR
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'
            AND institution_id = applications.institution_id));

CREATE POLICY "Advisors can create applications"
  ON applications FOR INSERT
  WITH CHECK (advisor_id = auth.uid());

CREATE POLICY "Advisors can update own draft applications"
  ON applications FOR UPDATE
  USING (advisor_id = auth.uid() AND status = 'draft')
  WITH CHECK (advisor_id = auth.uid() AND status = 'draft');

-- Comité can update decisions
CREATE POLICY "Comité can approve/reject applications"
  ON applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member')
             AND status IN ('submitted', 'under_review'));

-- Clients: Via applications
CREATE POLICY "Users can read clients in applications"
  ON clients FOR SELECT
  USING (EXISTS (SELECT 1 FROM applications
    WHERE (advisor_id = auth.uid() OR
           EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'))
    AND applications.institution_id = clients.institution_id
    AND (client_id = clients.id OR spouse_id = clients.id OR coapplicant_id = clients.id)));

-- Analysis results
CREATE POLICY "Can read analysis results"
  ON analysis_results FOR SELECT
  USING (EXISTS (SELECT 1 FROM applications
    WHERE applications.id = analysis_results.application_id
    AND (advisor_id = auth.uid() OR
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'))));

-- Notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================================
-- SEED DATA (Test Institution)
-- ============================================================================

INSERT INTO institutions (name, country, max_commercial_amount, max_agricultural_amount, min_monthly_income, default_rate, default_months)
VALUES (
  'Test Institution',
  'CO',
  50000000,
  100000000,
  500000,
  2.5,
  24
) ON CONFLICT (name) DO NOTHING;
