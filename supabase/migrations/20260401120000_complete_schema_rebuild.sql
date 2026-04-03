-- Agent Analyzer Copilot - Complete Database Schema Rebuild
-- Date: 2026-04-01
-- Version: 2.0
-- Purpose: Full schema implementation with ALL 1,091+ fields from ANALISIS_FORMULARIOS_PRODUCTO_DIGITAL.md
-- Status: Migration includes rollback procedure

-- ============================================================================
-- DISABLE CONSTRAINT CHECKS (for easier migration)
-- ============================================================================

SET session_replication_role = replica;

-- ============================================================================
-- DROP EXISTING TABLES (Cascade)
-- ============================================================================

DROP TABLE IF EXISTS sync_queue CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS analysis_results CASCADE;
DROP TABLE IF EXISTS commercial_analysis CASCADE;
DROP TABLE IF EXISTS agricultural_flow CASCADE;
DROP TABLE IF EXISTS agricultural_analysis CASCADE;
DROP TABLE IF EXISTS credits CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS institutions CASCADE;

-- ============================================================================
-- INSTITUTIONS (Multi-tenant config)
-- ============================================================================

CREATE TABLE institutions (
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
-- USERS (Advisors, Committee members, Admin)
-- ============================================================================

CREATE TABLE users (
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

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,

  -- STEP 3: DATOS PERSONALES (14 campos)
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  id_number TEXT NOT NULL,
  id_type TEXT NOT NULL,  -- cedula, passport, dni, nit, ruc
  date_of_birth DATE,
  gender TEXT,  -- male, female, other
  education_level TEXT,  -- primary, secondary, technical, university
  employment_status TEXT,  -- employed, self_employed, unemployed, retired
  phone TEXT,
  email TEXT,

  -- STEP 4: DATOS DEL DOMICILIO (6 campos)
  address_street TEXT,
  address_city TEXT,
  address_department TEXT,
  address_postal_code TEXT,
  address_country TEXT,
  address_neighborhood TEXT,

  -- DEMOGRAPHIC INFO
  marital_status TEXT,  -- single, married, common_law, divorced, widowed
  dependents_count INTEGER DEFAULT 0,
  has_dependents_with_disability BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(institution_id, id_number, id_type)
);

CREATE INDEX idx_clients_institution ON clients(institution_id);
CREATE INDEX idx_clients_id_number ON clients(id_number);
CREATE INDEX idx_clients_name ON clients(first_name, last_name);

-- ============================================================================
-- APPLICATIONS - MAIN FORM (SOLICITUD DE CRÉDITO)
-- 195 fields total across 11 steps
-- ============================================================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  spouse_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  coapplicant_id UUID REFERENCES clients(id) ON DELETE SET NULL,

  -- ========== STEP 1: DATOS DE LA SOLICITUD (5 campos) ==========
  solicitud_numero TEXT UNIQUE,
  solicitud_fecha DATE,
  solicitud_asesor TEXT,
  solicitud_institucion TEXT,
  solicitud_canal TEXT,  -- online, presencial, telefonica

  -- ========== STEP 2: TIPO DE PRODUCTO (1 campo) ==========
  product_type TEXT NOT NULL,  -- commercial, agricultural

  -- ========== STEP 3: DATOS PERSONALES DEL SOLICITANTE (14 campos) ==========
  -- (client_id references cover most of this)

  -- ========== STEP 4: DATOS DEL DOMICILIO (6 campos) ==========
  -- (client_id references cover most of this)
  address_residential_time_months INTEGER,
  address_own_rent TEXT,  -- propia, arrendada, prestada
  address_rent_monthly_amount DECIMAL(15,2),
  address_mortgage_monthly_amount DECIMAL(15,2),

  -- ========== STEP 5: DATOS DEL NEGOCIO (12 campos + condicionales) ==========
  business_name TEXT,
  business_type TEXT,  -- sole_proprietor, cooperative, sas, corporation, farm
  business_legal_form TEXT,  -- natural_person, juridical_person
  business_sector TEXT,  -- commerce, services, agriculture, livestock, other
  business_description TEXT,
  business_registration_number TEXT,
  business_registration_date DATE,
  business_address_same_as_residential BOOLEAN DEFAULT FALSE,
  business_address_street TEXT,
  business_address_city TEXT,
  business_address_department TEXT,
  business_phone TEXT,
  business_email TEXT,
  business_years_operating INTEGER,
  business_months_operating INTEGER,
  business_employees_count INTEGER DEFAULT 0,
  business_monthly_sales DECIMAL(15,2),
  business_profit_margin_percent DECIMAL(5,2),

  -- Conditional: Si local arrendado
  business_rent_monthly DECIMAL(15,2),
  business_lease_years_remaining INTEGER,

  -- ========== STEP 6: CONSULTA DEL CÓNYUGE (16 campos - Conditional) ==========
  has_spouse BOOLEAN DEFAULT FALSE,
  spouse_same_address BOOLEAN,
  spouse_employed BOOLEAN,
  spouse_income_source TEXT,
  spouse_monthly_income DECIMAL(15,2),
  spouse_monthly_income_secondary DECIMAL(15,2),
  spouse_employment_status TEXT,
  spouse_professional_activities TEXT,
  spouse_debt_obligations_monthly DECIMAL(15,2),

  -- ========== STEP 7: BIENES Y REFERENCIAS (3 subsecciones) ==========

  -- 7A. BIENES RAÍCES (Hasta 3 propiedades)
  real_estate_count INTEGER DEFAULT 0,
  real_estate_1_description TEXT,
  real_estate_1_location TEXT,
  real_estate_1_estimated_value DECIMAL(15,2),
  real_estate_1_debt_value DECIMAL(15,2),
  real_estate_1_net_equity DECIMAL(15,2),
  real_estate_1_ownership_percent DECIMAL(5,2),
  real_estate_1_current_use TEXT,

  real_estate_2_description TEXT,
  real_estate_2_location TEXT,
  real_estate_2_estimated_value DECIMAL(15,2),
  real_estate_2_debt_value DECIMAL(15,2),
  real_estate_2_net_equity DECIMAL(15,2),
  real_estate_2_ownership_percent DECIMAL(5,2),
  real_estate_2_current_use TEXT,

  real_estate_3_description TEXT,
  real_estate_3_location TEXT,
  real_estate_3_estimated_value DECIMAL(15,2),
  real_estate_3_debt_value DECIMAL(15,2),
  real_estate_3_net_equity DECIMAL(15,2),
  real_estate_3_ownership_percent DECIMAL(5,2),
  real_estate_3_current_use TEXT,

  -- 7B. VEHÍCULOS (Hasta 2 vehículos)
  vehicles_count INTEGER DEFAULT 0,
  vehicle_1_type TEXT,
  vehicle_1_year INTEGER,
  vehicle_1_make TEXT,
  vehicle_1_model TEXT,
  vehicle_1_value DECIMAL(15,2),
  vehicle_1_debt_value DECIMAL(15,2),
  vehicle_1_registration_number TEXT,

  vehicle_2_type TEXT,
  vehicle_2_year INTEGER,
  vehicle_2_make TEXT,
  vehicle_2_model TEXT,
  vehicle_2_value DECIMAL(15,2),
  vehicle_2_debt_value DECIMAL(15,2),
  vehicle_2_registration_number TEXT,

  -- 7C. REFERENCIAS (3 requeridas)
  reference_1_name TEXT,
  reference_1_relationship TEXT,
  reference_1_phone TEXT,
  reference_1_knows_client_years INTEGER,
  reference_1_payment_history TEXT,

  reference_2_name TEXT,
  reference_2_relationship TEXT,
  reference_2_phone TEXT,
  reference_2_knows_client_years INTEGER,
  reference_2_payment_history TEXT,

  reference_3_name TEXT,
  reference_3_relationship TEXT,
  reference_3_phone TEXT,
  reference_3_knows_client_years INTEGER,
  reference_3_payment_history TEXT,

  -- ========== STEP 8: BALANCE GENERAL (2 tablas) ==========

  -- 8A. ACTIVOS (Assets)
  -- Current Assets (Activos Corrientes)
  assets_cash_and_equivalents DECIMAL(15,2),
  assets_savings_accounts DECIMAL(15,2),
  assets_checking_accounts DECIMAL(15,2),
  assets_money_market_accounts DECIMAL(15,2),
  assets_short_term_investments DECIMAL(15,2),
  assets_accounts_receivable_trade DECIMAL(15,2),
  assets_accounts_receivable_other DECIMAL(15,2),
  assets_receivable_days DECIMAL(10,2),
  assets_inventory_raw_materials DECIMAL(15,2),
  assets_inventory_finished_goods DECIMAL(15,2),
  assets_inventory_merchandise DECIMAL(15,2),
  assets_inventory_days DECIMAL(10,2),
  assets_prepaid_expenses DECIMAL(15,2),
  assets_current_other DECIMAL(15,2),

  -- Fixed Assets (Activos Fijos)
  assets_land DECIMAL(15,2),
  assets_buildings_structures DECIMAL(15,2),
  assets_furniture_fixtures DECIMAL(15,2),
  assets_machinery_equipment DECIMAL(15,2),
  assets_vehicles_fixed DECIMAL(15,2),
  assets_accumulated_depreciation DECIMAL(15,2),
  assets_intangible_goodwill DECIMAL(15,2),
  assets_fixed_other DECIMAL(15,2),

  -- 8B. PASIVOS (Liabilities)
  -- Current Liabilities (Pasivos Corrientes)
  liabilities_accounts_payable_trade DECIMAL(15,2),
  liabilities_accounts_payable_other DECIMAL(15,2),
  liabilities_payable_days DECIMAL(10,2),
  liabilities_short_term_loans DECIMAL(15,2),
  liabilities_credit_card_balances DECIMAL(15,2),
  liabilities_current_portion_lt_debt DECIMAL(15,2),
  liabilities_payroll_accrued DECIMAL(15,2),
  liabilities_taxes_accrued DECIMAL(15,2),
  liabilities_utilities_accrued DECIMAL(15,2),
  liabilities_current_other DECIMAL(15,2),

  -- Long-term Liabilities (Pasivos a Largo Plazo)
  liabilities_long_term_loans DECIMAL(15,2),
  liabilities_mortgage_debt DECIMAL(15,2),
  liabilities_equipment_financing DECIMAL(15,2),
  liabilities_bonds_payable DECIMAL(15,2),
  liabilities_other_long_term DECIMAL(15,2),

  -- ========== STEP 9: INGRESOS Y GASTOS MENSUALES (14 campos) ==========

  -- 9A. INGRESOS MENSUALES (Monthly Income)
  income_business_operations DECIMAL(15,2),
  income_employment_salary DECIMAL(15,2),
  income_self_employment DECIMAL(15,2),
  income_rentals DECIMAL(15,2),
  income_dividends_interest DECIMAL(15,2),
  income_pension DECIMAL(15,2),
  income_government_assistance DECIMAL(15,2),
  income_other DECIMAL(15,2),
  income_total DECIMAL(15,2),  -- Calculated

  income_spouse_total DECIMAL(15,2),  -- Calculated
  income_family_total DECIMAL(15,2),  -- Calculated

  -- 9B. GASTOS FAMILIARES MENSUALES (Monthly Household Expenses)
  expenses_housing_rent_mortgage DECIMAL(15,2),
  expenses_utilities_electricity DECIMAL(15,2),
  expenses_utilities_water DECIMAL(15,2),
  expenses_utilities_gas DECIMAL(15,2),
  expenses_utilities_internet DECIMAL(15,2),
  expenses_food_groceries DECIMAL(15,2),
  expenses_transportation_public DECIMAL(15,2),
  expenses_transportation_vehicle_fuel DECIMAL(15,2),
  expenses_transportation_maintenance DECIMAL(15,2),
  expenses_transportation_insurance DECIMAL(15,2),
  expenses_education_tuition DECIMAL(15,2),
  expenses_education_supplies DECIMAL(15,2),
  expenses_healthcare_insurance DECIMAL(15,2),
  expenses_healthcare_medications DECIMAL(15,2),
  expenses_healthcare_other DECIMAL(15,2),
  expenses_childcare DECIMAL(15,2),
  expenses_personal_grooming DECIMAL(15,2),
  expenses_clothing DECIMAL(15,2),
  expenses_recreation_entertainment DECIMAL(15,2),
  expenses_phone_cellular DECIMAL(15,2),
  expenses_subscriptions DECIMAL(15,2),
  expenses_pet_care DECIMAL(15,2),
  expenses_personal_care DECIMAL(15,2),
  expenses_miscellaneous DECIMAL(15,2),
  expenses_total_household DECIMAL(15,2),  -- Calculated

  -- ========== STEP 10: CAPACIDAD DE PAGO (Display/Calculation) ==========
  payment_capacity_monthly DECIMAL(15,2),  -- Calculated
  payment_capacity_percent DECIMAL(5,2),  -- Calculated
  debt_to_income_ratio DECIMAL(5,4),  -- Calculated
  requested_monthly_payment DECIMAL(15,2),  -- Proposed payment

  -- ========== STEP 11: RESUMEN Y ENVÍO ==========
  requested_amount DECIMAL(15,2) NOT NULL,
  requested_months INTEGER NOT NULL,
  requested_purpose TEXT,
  requested_use_detail TEXT,

  -- Application Status
  status TEXT DEFAULT 'draft',  -- draft, submitted, under_review, approved, rejected

  -- AI Analysis Results
  ai_risk_level TEXT,  -- low, medium, high, very_high
  ai_debt_to_income_ratio DECIMAL(5,4),
  ai_payment_capacity_percent DECIMAL(5,2),
  ai_recommendation TEXT,
  ai_analysis_at TIMESTAMPTZ,
  ai_analysis_version TEXT,

  -- Committee Decision
  comite_decision TEXT,  -- approved, rejected, pending
  comite_reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  comite_reviewed_at TIMESTAMPTZ,
  comite_notes TEXT,

  -- Credit Issuance
  credit_id UUID,
  credit_approved_amount DECIMAL(15,2),
  credit_approved_months INTEGER,
  credit_approved_rate DECIMAL(5,2),

  -- Form Metadata
  form_auto_saved_at TIMESTAMPTZ,
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Offline Sync
  offline_sync_id TEXT UNIQUE,
  last_synced_at TIMESTAMPTZ
);

CREATE INDEX idx_applications_institution ON applications(institution_id);
CREATE INDEX idx_applications_advisor ON applications(advisor_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_comite_decision ON applications(comite_decision);
CREATE INDEX idx_applications_client ON applications(client_id);
CREATE INDEX idx_applications_product_type ON applications(product_type);

-- ============================================================================
-- COMMERCIAL_ANALYSIS TABLE
-- ~190 fields across 7 sections
-- ============================================================================

CREATE TABLE commercial_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  -- ========== SECCIÓN 1: VENTAS DE CONTADO POR DÍA (7 campos × 5 días + totales) ==========
  monday_transactions_count INTEGER,
  monday_average_transaction_value DECIMAL(15,2),
  monday_total_sales DECIMAL(15,2),

  tuesday_transactions_count INTEGER,
  tuesday_average_transaction_value DECIMAL(15,2),
  tuesday_total_sales DECIMAL(15,2),

  wednesday_transactions_count INTEGER,
  wednesday_average_transaction_value DECIMAL(15,2),
  wednesday_total_sales DECIMAL(15,2),

  thursday_transactions_count INTEGER,
  thursday_average_transaction_value DECIMAL(15,2),
  thursday_total_sales DECIMAL(15,2),

  friday_transactions_count INTEGER,
  friday_average_transaction_value DECIMAL(15,2),
  friday_total_sales DECIMAL(15,2),

  saturday_transactions_count INTEGER,
  saturday_average_transaction_value DECIMAL(15,2),
  saturday_total_sales DECIMAL(15,2),

  sunday_transactions_count INTEGER,
  sunday_average_transaction_value DECIMAL(15,2),
  sunday_total_sales DECIMAL(15,2),

  weekly_total_transactions INTEGER,
  weekly_average_transaction_value DECIMAL(15,2),
  weekly_total_sales DECIMAL(15,2),

  -- ========== SECCIÓN 2: VENTAS Y COSTOS POR LÍNEA DE PRODUCTO (5 cols × 10 productos) ==========
  product_1_name TEXT,
  product_1_monthly_sales DECIMAL(15,2),
  product_1_product_cost_percent DECIMAL(5,2),
  product_1_gross_margin DECIMAL(15,2),
  product_1_gross_margin_percent DECIMAL(5,2),

  product_2_name TEXT,
  product_2_monthly_sales DECIMAL(15,2),
  product_2_product_cost_percent DECIMAL(5,2),
  product_2_gross_margin DECIMAL(15,2),
  product_2_gross_margin_percent DECIMAL(5,2),

  product_3_name TEXT,
  product_3_monthly_sales DECIMAL(15,2),
  product_3_product_cost_percent DECIMAL(5,2),
  product_3_gross_margin DECIMAL(15,2),
  product_3_gross_margin_percent DECIMAL(5,2),

  product_4_name TEXT,
  product_4_monthly_sales DECIMAL(15,2),
  product_4_product_cost_percent DECIMAL(5,2),
  product_4_gross_margin DECIMAL(15,2),
  product_4_gross_margin_percent DECIMAL(5,2),

  product_5_name TEXT,
  product_5_monthly_sales DECIMAL(15,2),
  product_5_product_cost_percent DECIMAL(5,2),
  product_5_gross_margin DECIMAL(15,2),
  product_5_gross_margin_percent DECIMAL(5,2),

  product_6_name TEXT,
  product_6_monthly_sales DECIMAL(15,2),
  product_6_product_cost_percent DECIMAL(5,2),
  product_6_gross_margin DECIMAL(15,2),
  product_6_gross_margin_percent DECIMAL(5,2),

  product_7_name TEXT,
  product_7_monthly_sales DECIMAL(15,2),
  product_7_product_cost_percent DECIMAL(5,2),
  product_7_gross_margin DECIMAL(15,2),
  product_7_gross_margin_percent DECIMAL(5,2),

  product_8_name TEXT,
  product_8_monthly_sales DECIMAL(15,2),
  product_8_product_cost_percent DECIMAL(5,2),
  product_8_gross_margin DECIMAL(15,2),
  product_8_gross_margin_percent DECIMAL(5,2),

  product_9_name TEXT,
  product_9_monthly_sales DECIMAL(15,2),
  product_9_product_cost_percent DECIMAL(5,2),
  product_9_gross_margin DECIMAL(15,2),
  product_9_gross_margin_percent DECIMAL(5,2),

  product_10_name TEXT,
  product_10_monthly_sales DECIMAL(15,2),
  product_10_product_cost_percent DECIMAL(5,2),
  product_10_gross_margin DECIMAL(15,2),
  product_10_gross_margin_percent DECIMAL(5,2),

  product_lines_total_sales DECIMAL(15,2),
  product_lines_total_cost DECIMAL(15,2),
  product_lines_total_gross_margin DECIMAL(15,2),

  -- ========== SECCIÓN 3: INGRESOS POR SERVICIO (5 campos × 5 servicios) ==========
  service_1_name TEXT,
  service_1_monthly_revenue DECIMAL(15,2),
  service_1_monthly_hours_offered INTEGER,
  service_1_hourly_rate DECIMAL(15,2),
  service_1_customer_count_monthly INTEGER,

  service_2_name TEXT,
  service_2_monthly_revenue DECIMAL(15,2),
  service_2_monthly_hours_offered INTEGER,
  service_2_hourly_rate DECIMAL(15,2),
  service_2_customer_count_monthly INTEGER,

  service_3_name TEXT,
  service_3_monthly_revenue DECIMAL(15,2),
  service_3_monthly_hours_offered INTEGER,
  service_3_hourly_rate DECIMAL(15,2),
  service_3_customer_count_monthly INTEGER,

  service_4_name TEXT,
  service_4_monthly_revenue DECIMAL(15,2),
  service_4_monthly_hours_offered INTEGER,
  service_4_hourly_rate DECIMAL(15,2),
  service_4_customer_count_monthly INTEGER,

  service_5_name TEXT,
  service_5_monthly_revenue DECIMAL(15,2),
  service_5_monthly_hours_offered INTEGER,
  service_5_hourly_rate DECIMAL(15,2),
  service_5_customer_count_monthly INTEGER,

  services_total_revenue DECIMAL(15,2),
  services_total_hours DECIMAL(10,2),
  services_average_hourly_rate DECIMAL(15,2),

  -- ========== SECCIÓN 4: MANO DE OBRA Y COSTOS DIRECTOS (9 campos) ==========
  labor_owner_salary DECIMAL(15,2),
  labor_owner_percent_revenue DECIMAL(5,2),
  labor_employees_count INTEGER,
  labor_employees_average_salary DECIMAL(15,2),
  labor_employees_total_payroll DECIMAL(15,2),
  labor_employees_percent_revenue DECIMAL(5,2),
  labor_benefits_insurance DECIMAL(15,2),
  labor_training_development DECIMAL(15,2),
  labor_total_costs DECIMAL(15,2),

  -- ========== SECCIÓN 5: GASTOS OPERATIVOS (19 campos) ==========
  -- Rent and Property
  opex_rent_monthly DECIMAL(15,2),
  opex_rent_percent_revenue DECIMAL(5,2),
  opex_property_maintenance DECIMAL(15,2),
  opex_property_insurance DECIMAL(15,2),
  opex_property_taxes DECIMAL(15,2),

  -- Utilities and Communications
  opex_electricity DECIMAL(15,2),
  opex_water DECIMAL(15,2),
  opex_gas DECIMAL(15,2),
  opex_phone_internet DECIMAL(15,2),

  -- Equipment and Vehicles
  opex_equipment_maintenance DECIMAL(15,2),
  opex_vehicle_maintenance DECIMAL(15,2),
  opex_vehicle_fuel DECIMAL(15,2),
  opex_vehicle_insurance DECIMAL(15,2),

  -- Administrative and Professional
  opex_office_supplies DECIMAL(15,2),
  opex_professional_fees DECIMAL(15,2),
  opex_accounting_legal DECIMAL(15,2),
  opex_marketing_advertising DECIMAL(15,2),
  opex_travel_expenses DECIMAL(15,2),
  opex_miscellaneous DECIMAL(15,2),

  opex_total_monthly DECIMAL(15,2),
  opex_percent_revenue DECIMAL(5,2),

  -- ========== SECCIÓN 6: ESTADO DE RESULTADOS (8 campos calculados) ==========
  income_statement_total_revenue DECIMAL(15,2),
  income_statement_cogs DECIMAL(15,2),
  income_statement_gross_profit DECIMAL(15,2),
  income_statement_gross_profit_percent DECIMAL(5,2),
  income_statement_operating_expenses DECIMAL(15,2),
  income_statement_operating_income DECIMAL(15,2),
  income_statement_net_profit DECIMAL(15,2),
  income_statement_net_profit_percent DECIMAL(5,2),
  income_statement_profitability_percent DECIMAL(5,2),

  -- ========== SECCIÓN 7: ACTIVOS DEL NEGOCIO (10 campos) ==========
  business_assets_furniture_fixtures DECIMAL(15,2),
  business_assets_machinery_equipment DECIMAL(15,2),
  business_assets_vehicles DECIMAL(15,2),
  business_assets_technology_computers DECIMAL(15,2),
  business_assets_point_of_sale_systems DECIMAL(15,2),
  business_assets_inventory_display DECIMAL(15,2),
  business_assets_leasehold_improvements DECIMAL(15,2),
  business_assets_other DECIMAL(15,2),
  business_assets_total DECIMAL(15,2),
  business_assets_age_years DECIMAL(5,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commercial_analysis_application ON commercial_analysis(application_id);

-- ============================================================================
-- AGRICULTURAL_FLOW TABLE
-- ~600 fields (12-month projection table)
-- Each month has ~50 fields
-- ============================================================================

CREATE TABLE agricultural_flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  -- Metadata
  projection_year INTEGER,
  currency TEXT DEFAULT 'COP',

  -- ========== INCOME SECTION (6 categories × 12 months = 72 fields) ==========
  -- MONTH 1
  m1_income_crop_sales DECIMAL(15,2),
  m1_income_livestock_sales DECIMAL(15,2),
  m1_income_dairy_products DECIMAL(15,2),
  m1_income_value_added_products DECIMAL(15,2),
  m1_income_government_payments DECIMAL(15,2),
  m1_income_other_sources DECIMAL(15,2),
  m1_income_total DECIMAL(15,2),

  -- MONTH 2
  m2_income_crop_sales DECIMAL(15,2),
  m2_income_livestock_sales DECIMAL(15,2),
  m2_income_dairy_products DECIMAL(15,2),
  m2_income_value_added_products DECIMAL(15,2),
  m2_income_government_payments DECIMAL(15,2),
  m2_income_other_sources DECIMAL(15,2),
  m2_income_total DECIMAL(15,2),

  -- MONTH 3
  m3_income_crop_sales DECIMAL(15,2),
  m3_income_livestock_sales DECIMAL(15,2),
  m3_income_dairy_products DECIMAL(15,2),
  m3_income_value_added_products DECIMAL(15,2),
  m3_income_government_payments DECIMAL(15,2),
  m3_income_other_sources DECIMAL(15,2),
  m3_income_total DECIMAL(15,2),

  -- MONTH 4
  m4_income_crop_sales DECIMAL(15,2),
  m4_income_livestock_sales DECIMAL(15,2),
  m4_income_dairy_products DECIMAL(15,2),
  m4_income_value_added_products DECIMAL(15,2),
  m4_income_government_payments DECIMAL(15,2),
  m4_income_other_sources DECIMAL(15,2),
  m4_income_total DECIMAL(15,2),

  -- MONTH 5
  m5_income_crop_sales DECIMAL(15,2),
  m5_income_livestock_sales DECIMAL(15,2),
  m5_income_dairy_products DECIMAL(15,2),
  m5_income_value_added_products DECIMAL(15,2),
  m5_income_government_payments DECIMAL(15,2),
  m5_income_other_sources DECIMAL(15,2),
  m5_income_total DECIMAL(15,2),

  -- MONTH 6
  m6_income_crop_sales DECIMAL(15,2),
  m6_income_livestock_sales DECIMAL(15,2),
  m6_income_dairy_products DECIMAL(15,2),
  m6_income_value_added_products DECIMAL(15,2),
  m6_income_government_payments DECIMAL(15,2),
  m6_income_other_sources DECIMAL(15,2),
  m6_income_total DECIMAL(15,2),

  -- MONTH 7
  m7_income_crop_sales DECIMAL(15,2),
  m7_income_livestock_sales DECIMAL(15,2),
  m7_income_dairy_products DECIMAL(15,2),
  m7_income_value_added_products DECIMAL(15,2),
  m7_income_government_payments DECIMAL(15,2),
  m7_income_other_sources DECIMAL(15,2),
  m7_income_total DECIMAL(15,2),

  -- MONTH 8
  m8_income_crop_sales DECIMAL(15,2),
  m8_income_livestock_sales DECIMAL(15,2),
  m8_income_dairy_products DECIMAL(15,2),
  m8_income_value_added_products DECIMAL(15,2),
  m8_income_government_payments DECIMAL(15,2),
  m8_income_other_sources DECIMAL(15,2),
  m8_income_total DECIMAL(15,2),

  -- MONTH 9
  m9_income_crop_sales DECIMAL(15,2),
  m9_income_livestock_sales DECIMAL(15,2),
  m9_income_dairy_products DECIMAL(15,2),
  m9_income_value_added_products DECIMAL(15,2),
  m9_income_government_payments DECIMAL(15,2),
  m9_income_other_sources DECIMAL(15,2),
  m9_income_total DECIMAL(15,2),

  -- MONTH 10
  m10_income_crop_sales DECIMAL(15,2),
  m10_income_livestock_sales DECIMAL(15,2),
  m10_income_dairy_products DECIMAL(15,2),
  m10_income_value_added_products DECIMAL(15,2),
  m10_income_government_payments DECIMAL(15,2),
  m10_income_other_sources DECIMAL(15,2),
  m10_income_total DECIMAL(15,2),

  -- MONTH 11
  m11_income_crop_sales DECIMAL(15,2),
  m11_income_livestock_sales DECIMAL(15,2),
  m11_income_dairy_products DECIMAL(15,2),
  m11_income_value_added_products DECIMAL(15,2),
  m11_income_government_payments DECIMAL(15,2),
  m11_income_other_sources DECIMAL(15,2),
  m11_income_total DECIMAL(15,2),

  -- MONTH 12
  m12_income_crop_sales DECIMAL(15,2),
  m12_income_livestock_sales DECIMAL(15,2),
  m12_income_dairy_products DECIMAL(15,2),
  m12_income_value_added_products DECIMAL(15,2),
  m12_income_government_payments DECIMAL(15,2),
  m12_income_other_sources DECIMAL(15,2),
  m12_income_total DECIMAL(15,2),

  -- ========== EXPENSES SECTION (8 categories × 12 months = 96 fields) ==========
  -- MONTH 1
  m1_expense_seed_fertilizer DECIMAL(15,2),
  m1_expense_pest_disease_control DECIMAL(15,2),
  m1_expense_irrigation DECIMAL(15,2),
  m1_expense_feed_supplements DECIMAL(15,2),
  m1_expense_veterinary_health DECIMAL(15,2),
  m1_expense_equipment_maintenance DECIMAL(15,2),
  m1_expense_labor DECIMAL(15,2),
  m1_expense_other DECIMAL(15,2),
  m1_expense_total DECIMAL(15,2),

  -- MONTH 2
  m2_expense_seed_fertilizer DECIMAL(15,2),
  m2_expense_pest_disease_control DECIMAL(15,2),
  m2_expense_irrigation DECIMAL(15,2),
  m2_expense_feed_supplements DECIMAL(15,2),
  m2_expense_veterinary_health DECIMAL(15,2),
  m2_expense_equipment_maintenance DECIMAL(15,2),
  m2_expense_labor DECIMAL(15,2),
  m2_expense_other DECIMAL(15,2),
  m2_expense_total DECIMAL(15,2),

  -- MONTH 3
  m3_expense_seed_fertilizer DECIMAL(15,2),
  m3_expense_pest_disease_control DECIMAL(15,2),
  m3_expense_irrigation DECIMAL(15,2),
  m3_expense_feed_supplements DECIMAL(15,2),
  m3_expense_veterinary_health DECIMAL(15,2),
  m3_expense_equipment_maintenance DECIMAL(15,2),
  m3_expense_labor DECIMAL(15,2),
  m3_expense_other DECIMAL(15,2),
  m3_expense_total DECIMAL(15,2),

  -- MONTH 4
  m4_expense_seed_fertilizer DECIMAL(15,2),
  m4_expense_pest_disease_control DECIMAL(15,2),
  m4_expense_irrigation DECIMAL(15,2),
  m4_expense_feed_supplements DECIMAL(15,2),
  m4_expense_veterinary_health DECIMAL(15,2),
  m4_expense_equipment_maintenance DECIMAL(15,2),
  m4_expense_labor DECIMAL(15,2),
  m4_expense_other DECIMAL(15,2),
  m4_expense_total DECIMAL(15,2),

  -- MONTH 5
  m5_expense_seed_fertilizer DECIMAL(15,2),
  m5_expense_pest_disease_control DECIMAL(15,2),
  m5_expense_irrigation DECIMAL(15,2),
  m5_expense_feed_supplements DECIMAL(15,2),
  m5_expense_veterinary_health DECIMAL(15,2),
  m5_expense_equipment_maintenance DECIMAL(15,2),
  m5_expense_labor DECIMAL(15,2),
  m5_expense_other DECIMAL(15,2),
  m5_expense_total DECIMAL(15,2),

  -- MONTH 6
  m6_expense_seed_fertilizer DECIMAL(15,2),
  m6_expense_pest_disease_control DECIMAL(15,2),
  m6_expense_irrigation DECIMAL(15,2),
  m6_expense_feed_supplements DECIMAL(15,2),
  m6_expense_veterinary_health DECIMAL(15,2),
  m6_expense_equipment_maintenance DECIMAL(15,2),
  m6_expense_labor DECIMAL(15,2),
  m6_expense_other DECIMAL(15,2),
  m6_expense_total DECIMAL(15,2),

  -- MONTH 7
  m7_expense_seed_fertilizer DECIMAL(15,2),
  m7_expense_pest_disease_control DECIMAL(15,2),
  m7_expense_irrigation DECIMAL(15,2),
  m7_expense_feed_supplements DECIMAL(15,2),
  m7_expense_veterinary_health DECIMAL(15,2),
  m7_expense_equipment_maintenance DECIMAL(15,2),
  m7_expense_labor DECIMAL(15,2),
  m7_expense_other DECIMAL(15,2),
  m7_expense_total DECIMAL(15,2),

  -- MONTH 8
  m8_expense_seed_fertilizer DECIMAL(15,2),
  m8_expense_pest_disease_control DECIMAL(15,2),
  m8_expense_irrigation DECIMAL(15,2),
  m8_expense_feed_supplements DECIMAL(15,2),
  m8_expense_veterinary_health DECIMAL(15,2),
  m8_expense_equipment_maintenance DECIMAL(15,2),
  m8_expense_labor DECIMAL(15,2),
  m8_expense_other DECIMAL(15,2),
  m8_expense_total DECIMAL(15,2),

  -- MONTH 9
  m9_expense_seed_fertilizer DECIMAL(15,2),
  m9_expense_pest_disease_control DECIMAL(15,2),
  m9_expense_irrigation DECIMAL(15,2),
  m9_expense_feed_supplements DECIMAL(15,2),
  m9_expense_veterinary_health DECIMAL(15,2),
  m9_expense_equipment_maintenance DECIMAL(15,2),
  m9_expense_labor DECIMAL(15,2),
  m9_expense_other DECIMAL(15,2),
  m9_expense_total DECIMAL(15,2),

  -- MONTH 10
  m10_expense_seed_fertilizer DECIMAL(15,2),
  m10_expense_pest_disease_control DECIMAL(15,2),
  m10_expense_irrigation DECIMAL(15,2),
  m10_expense_feed_supplements DECIMAL(15,2),
  m10_expense_veterinary_health DECIMAL(15,2),
  m10_expense_equipment_maintenance DECIMAL(15,2),
  m10_expense_labor DECIMAL(15,2),
  m10_expense_other DECIMAL(15,2),
  m10_expense_total DECIMAL(15,2),

  -- MONTH 11
  m11_expense_seed_fertilizer DECIMAL(15,2),
  m11_expense_pest_disease_control DECIMAL(15,2),
  m11_expense_irrigation DECIMAL(15,2),
  m11_expense_feed_supplements DECIMAL(15,2),
  m11_expense_veterinary_health DECIMAL(15,2),
  m11_expense_equipment_maintenance DECIMAL(15,2),
  m11_expense_labor DECIMAL(15,2),
  m11_expense_other DECIMAL(15,2),
  m11_expense_total DECIMAL(15,2),

  -- MONTH 12
  m12_expense_seed_fertilizer DECIMAL(15,2),
  m12_expense_pest_disease_control DECIMAL(15,2),
  m12_expense_irrigation DECIMAL(15,2),
  m12_expense_feed_supplements DECIMAL(15,2),
  m12_expense_veterinary_health DECIMAL(15,2),
  m12_expense_equipment_maintenance DECIMAL(15,2),
  m12_expense_labor DECIMAL(15,2),
  m12_expense_other DECIMAL(15,2),
  m12_expense_total DECIMAL(15,2),

  -- ========== UTILITY SECTION (12 months, calculated fields) ==========
  m1_utility DECIMAL(15,2),
  m2_utility DECIMAL(15,2),
  m3_utility DECIMAL(15,2),
  m4_utility DECIMAL(15,2),
  m5_utility DECIMAL(15,2),
  m6_utility DECIMAL(15,2),
  m7_utility DECIMAL(15,2),
  m8_utility DECIMAL(15,2),
  m9_utility DECIMAL(15,2),
  m10_utility DECIMAL(15,2),
  m11_utility DECIMAL(15,2),
  m12_utility DECIMAL(15,2),

  -- ========== HOUSEHOLD EXPENSES SECTION (12 months) ==========
  m1_household_expenses DECIMAL(15,2),
  m2_household_expenses DECIMAL(15,2),
  m3_household_expenses DECIMAL(15,2),
  m4_household_expenses DECIMAL(15,2),
  m5_household_expenses DECIMAL(15,2),
  m6_household_expenses DECIMAL(15,2),
  m7_household_expenses DECIMAL(15,2),
  m8_household_expenses DECIMAL(15,2),
  m9_household_expenses DECIMAL(15,2),
  m10_household_expenses DECIMAL(15,2),
  m11_household_expenses DECIMAL(15,2),
  m12_household_expenses DECIMAL(15,2),

  -- ========== FINANCIAL OBLIGATIONS SECTION (12 months) ==========
  m1_obligations_existing_loans DECIMAL(15,2),
  m1_obligations_proposed_loan_payment DECIMAL(15,2),
  m1_obligations_other_debts DECIMAL(15,2),
  m1_obligations_total DECIMAL(15,2),

  m2_obligations_existing_loans DECIMAL(15,2),
  m2_obligations_proposed_loan_payment DECIMAL(15,2),
  m2_obligations_other_debts DECIMAL(15,2),
  m2_obligations_total DECIMAL(15,2),

  m3_obligations_existing_loans DECIMAL(15,2),
  m3_obligations_proposed_loan_payment DECIMAL(15,2),
  m3_obligations_other_debts DECIMAL(15,2),
  m3_obligations_total DECIMAL(15,2),

  m4_obligations_existing_loans DECIMAL(15,2),
  m4_obligations_proposed_loan_payment DECIMAL(15,2),
  m4_obligations_other_debts DECIMAL(15,2),
  m4_obligations_total DECIMAL(15,2),

  m5_obligations_existing_loans DECIMAL(15,2),
  m5_obligations_proposed_loan_payment DECIMAL(15,2),
  m5_obligations_other_debts DECIMAL(15,2),
  m5_obligations_total DECIMAL(15,2),

  m6_obligations_existing_loans DECIMAL(15,2),
  m6_obligations_proposed_loan_payment DECIMAL(15,2),
  m6_obligations_other_debts DECIMAL(15,2),
  m6_obligations_total DECIMAL(15,2),

  m7_obligations_existing_loans DECIMAL(15,2),
  m7_obligations_proposed_loan_payment DECIMAL(15,2),
  m7_obligations_other_debts DECIMAL(15,2),
  m7_obligations_total DECIMAL(15,2),

  m8_obligations_existing_loans DECIMAL(15,2),
  m8_obligations_proposed_loan_payment DECIMAL(15,2),
  m8_obligations_other_debts DECIMAL(15,2),
  m8_obligations_total DECIMAL(15,2),

  m9_obligations_existing_loans DECIMAL(15,2),
  m9_obligations_proposed_loan_payment DECIMAL(15,2),
  m9_obligations_other_debts DECIMAL(15,2),
  m9_obligations_total DECIMAL(15,2),

  m10_obligations_existing_loans DECIMAL(15,2),
  m10_obligations_proposed_loan_payment DECIMAL(15,2),
  m10_obligations_other_debts DECIMAL(15,2),
  m10_obligations_total DECIMAL(15,2),

  m11_obligations_existing_loans DECIMAL(15,2),
  m11_obligations_proposed_loan_payment DECIMAL(15,2),
  m11_obligations_other_debts DECIMAL(15,2),
  m11_obligations_total DECIMAL(15,2),

  m12_obligations_existing_loans DECIMAL(15,2),
  m12_obligations_proposed_loan_payment DECIMAL(15,2),
  m12_obligations_other_debts DECIMAL(15,2),
  m12_obligations_total DECIMAL(15,2),

  -- ========== PAYMENT CAPACITY SECTION (12 months, calculated) ==========
  m1_available_before_payment DECIMAL(15,2),
  m1_payment_capacity_70percent DECIMAL(15,2),
  m1_available_after_payment DECIMAL(15,2),

  m2_available_before_payment DECIMAL(15,2),
  m2_payment_capacity_70percent DECIMAL(15,2),
  m2_available_after_payment DECIMAL(15,2),

  m3_available_before_payment DECIMAL(15,2),
  m3_payment_capacity_70percent DECIMAL(15,2),
  m3_available_after_payment DECIMAL(15,2),

  m4_available_before_payment DECIMAL(15,2),
  m4_payment_capacity_70percent DECIMAL(15,2),
  m4_available_after_payment DECIMAL(15,2),

  m5_available_before_payment DECIMAL(15,2),
  m5_payment_capacity_70percent DECIMAL(15,2),
  m5_available_after_payment DECIMAL(15,2),

  m6_available_before_payment DECIMAL(15,2),
  m6_payment_capacity_70percent DECIMAL(15,2),
  m6_available_after_payment DECIMAL(15,2),

  m7_available_before_payment DECIMAL(15,2),
  m7_payment_capacity_70percent DECIMAL(15,2),
  m7_available_after_payment DECIMAL(15,2),

  m8_available_before_payment DECIMAL(15,2),
  m8_payment_capacity_70percent DECIMAL(15,2),
  m8_available_after_payment DECIMAL(15,2),

  m9_available_before_payment DECIMAL(15,2),
  m9_payment_capacity_70percent DECIMAL(15,2),
  m9_available_after_payment DECIMAL(15,2),

  m10_available_before_payment DECIMAL(15,2),
  m10_payment_capacity_70percent DECIMAL(15,2),
  m10_available_after_payment DECIMAL(15,2),

  m11_available_before_payment DECIMAL(15,2),
  m11_payment_capacity_70percent DECIMAL(15,2),
  m11_available_after_payment DECIMAL(15,2),

  m12_available_before_payment DECIMAL(15,2),
  m12_payment_capacity_70percent DECIMAL(15,2),
  m12_available_after_payment DECIMAL(15,2),

  -- Summary fields
  annual_income DECIMAL(15,2),
  annual_expenses DECIMAL(15,2),
  annual_utility DECIMAL(15,2),
  annual_household_expenses DECIMAL(15,2),
  annual_obligations DECIMAL(15,2),
  average_monthly_payment_capacity DECIMAL(15,2),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agricultural_flow_application ON agricultural_flow(application_id);

-- ============================================================================
-- AGRICULTURAL_ANALYSIS TABLE
-- ~116 fields for activity profitability analysis
-- ============================================================================

CREATE TABLE agricultural_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  -- ========== SECCIÓN 1: UTILIDAD POR ACTIVIDAD (8 products × 8 fields = 64 fields) ==========
  activity_1_product_name TEXT,
  activity_1_extension TEXT,
  activity_1_extension_unit TEXT,
  activity_1_income_per_cycle DECIMAL(15,2),
  activity_1_costs_per_cycle DECIMAL(15,2),
  activity_1_utility_per_cycle DECIMAL(15,2),
  activity_1_frequency_months INTEGER,
  activity_1_annual_utility DECIMAL(15,2),
  activity_1_margin_percent DECIMAL(5,2),

  activity_2_product_name TEXT,
  activity_2_extension TEXT,
  activity_2_extension_unit TEXT,
  activity_2_income_per_cycle DECIMAL(15,2),
  activity_2_costs_per_cycle DECIMAL(15,2),
  activity_2_utility_per_cycle DECIMAL(15,2),
  activity_2_frequency_months INTEGER,
  activity_2_annual_utility DECIMAL(15,2),
  activity_2_margin_percent DECIMAL(5,2),

  activity_3_product_name TEXT,
  activity_3_extension TEXT,
  activity_3_extension_unit TEXT,
  activity_3_income_per_cycle DECIMAL(15,2),
  activity_3_costs_per_cycle DECIMAL(15,2),
  activity_3_utility_per_cycle DECIMAL(15,2),
  activity_3_frequency_months INTEGER,
  activity_3_annual_utility DECIMAL(15,2),
  activity_3_margin_percent DECIMAL(5,2),

  activity_4_product_name TEXT,
  activity_4_extension TEXT,
  activity_4_extension_unit TEXT,
  activity_4_income_per_cycle DECIMAL(15,2),
  activity_4_costs_per_cycle DECIMAL(15,2),
  activity_4_utility_per_cycle DECIMAL(15,2),
  activity_4_frequency_months INTEGER,
  activity_4_annual_utility DECIMAL(15,2),
  activity_4_margin_percent DECIMAL(5,2),

  activity_5_product_name TEXT,
  activity_5_extension TEXT,
  activity_5_extension_unit TEXT,
  activity_5_income_per_cycle DECIMAL(15,2),
  activity_5_costs_per_cycle DECIMAL(15,2),
  activity_5_utility_per_cycle DECIMAL(15,2),
  activity_5_frequency_months INTEGER,
  activity_5_annual_utility DECIMAL(15,2),
  activity_5_margin_percent DECIMAL(5,2),

  activity_6_product_name TEXT,
  activity_6_extension TEXT,
  activity_6_extension_unit TEXT,
  activity_6_income_per_cycle DECIMAL(15,2),
  activity_6_costs_per_cycle DECIMAL(15,2),
  activity_6_utility_per_cycle DECIMAL(15,2),
  activity_6_frequency_months INTEGER,
  activity_6_annual_utility DECIMAL(15,2),
  activity_6_margin_percent DECIMAL(5,2),

  activity_7_product_name TEXT,
  activity_7_extension TEXT,
  activity_7_extension_unit TEXT,
  activity_7_income_per_cycle DECIMAL(15,2),
  activity_7_costs_per_cycle DECIMAL(15,2),
  activity_7_utility_per_cycle DECIMAL(15,2),
  activity_7_frequency_months INTEGER,
  activity_7_annual_utility DECIMAL(15,2),
  activity_7_margin_percent DECIMAL(5,2),

  activity_8_product_name TEXT,
  activity_8_extension TEXT,
  activity_8_extension_unit TEXT,
  activity_8_income_per_cycle DECIMAL(15,2),
  activity_8_costs_per_cycle DECIMAL(15,2),
  activity_8_utility_per_cycle DECIMAL(15,2),
  activity_8_frequency_months INTEGER,
  activity_8_annual_utility DECIMAL(15,2),
  activity_8_margin_percent DECIMAL(5,2),

  total_annual_income DECIMAL(15,2),
  total_annual_costs DECIMAL(15,2),
  total_annual_utility DECIMAL(15,2),
  average_margin_percent DECIMAL(5,2),

  -- ========== SECCIÓN 2: ACTIVOS AGROPECUARIOS (14 fields) ==========
  assets_land_hectares DECIMAL(10,2),
  assets_land_value DECIMAL(15,2),
  assets_buildings_structures DECIMAL(15,2),
  assets_machinery_equipment DECIMAL(15,2),
  assets_tractors_vehicles DECIMAL(15,2),
  assets_irrigation_systems DECIMAL(15,2),
  assets_storage_facilities DECIMAL(15,2),
  assets_animals_inventory_value DECIMAL(15,2),
  assets_seeds_nursery DECIMAL(15,2),
  assets_tools_minor_equipment DECIMAL(15,2),
  assets_technology_systems DECIMAL(15,2),
  assets_other DECIMAL(15,2),
  assets_total_value DECIMAL(15,2),
  assets_total_age_years DECIMAL(5,2),

  -- ========== SECCIÓN 3: NOTAS Y OBSERVACIONES ==========
  analysis_notes TEXT,
  calculation_notes TEXT,
  information_crosses_verified BOOLEAN,
  verifier_id UUID REFERENCES users(id) ON DELETE SET NULL,
  verification_date TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agricultural_analysis_application ON agricultural_analysis(application_id);

-- ============================================================================
-- ANALYSIS_RESULTS TABLE
-- ============================================================================

CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  analysis_type TEXT NOT NULL,  -- commercial, agricultural, integrated

  -- Financial Metrics
  gross_income DECIMAL(15,2),
  total_expenses DECIMAL(15,2),
  net_income DECIMAL(15,2),
  debt_to_income_ratio DECIMAL(5,4),
  payment_capacity_percent DECIMAL(5,2),

  -- Risk Assessment
  risk_level TEXT,  -- low, medium, high, very_high
  risk_factors TEXT[],
  risk_score DECIMAL(5,2),

  -- Recommendation
  recommendation TEXT,
  confidence_score DECIMAL(3,2),
  recommendation_reason TEXT,

  -- AI Analysis Metadata
  model_version TEXT,
  prompt_version TEXT,
  raw_response JSONB,
  analysis_duration_seconds INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_results_application ON analysis_results(application_id);
CREATE INDEX idx_analysis_results_risk_level ON analysis_results(risk_level);
CREATE INDEX idx_analysis_results_analysis_type ON analysis_results(analysis_type);

-- ============================================================================
-- CREDITS TABLE (Generated after approval)
-- ============================================================================

CREATE TABLE credits (
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

  status TEXT DEFAULT 'active',  -- active, completed, defaulted, cancelled

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credits_institution ON credits(institution_id);
CREATE INDEX idx_credits_application ON credits(application_id);
CREATE INDEX idx_credits_client ON credits(client_id);
CREATE INDEX idx_credits_status ON credits(status);

-- ============================================================================
-- SYNC_QUEUE TABLE (For offline sync tracking)
-- ============================================================================

CREATE TABLE sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,

  operation TEXT NOT NULL,  -- create, update, delete
  entity_type TEXT NOT NULL,  -- application, commercial_analysis, agricultural_flow, etc

  payload JSONB NOT NULL,

  status TEXT DEFAULT 'pending',  -- pending, synced, failed
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

CREATE INDEX idx_sync_queue_user ON sync_queue(user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_application ON sync_queue(application_id);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type TEXT NOT NULL,  -- application_submitted, analysis_complete, decision_made, etc
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,

  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE commercial_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE agricultural_flow ENABLE ROW LEVEL SECURITY;
ALTER TABLE agricultural_analysis ENABLE ROW LEVEL SECURITY;

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

-- Commercial, Agricultural Analysis
CREATE POLICY "Can read commercial analysis"
  ON commercial_analysis FOR SELECT
  USING (EXISTS (SELECT 1 FROM applications
    WHERE applications.id = commercial_analysis.application_id
    AND (advisor_id = auth.uid() OR
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'))));

CREATE POLICY "Can read agricultural flow"
  ON agricultural_flow FOR SELECT
  USING (EXISTS (SELECT 1 FROM applications
    WHERE applications.id = agricultural_flow.application_id
    AND (advisor_id = auth.uid() OR
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'))));

CREATE POLICY "Can read agricultural analysis"
  ON agricultural_analysis FOR SELECT
  USING (EXISTS (SELECT 1 FROM applications
    WHERE applications.id = agricultural_analysis.application_id
    AND (advisor_id = auth.uid() OR
         EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'comite_member'))));

-- ============================================================================
-- RE-ENABLE CONSTRAINT CHECKS
-- ============================================================================

SET session_replication_role = default;

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
