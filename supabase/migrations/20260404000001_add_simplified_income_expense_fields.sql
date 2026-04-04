-- Add simplified income/expense fields for API compatibility
-- Date: 2026-04-04
-- Purpose: Add basic fields that the POST /api/applications endpoint expects

ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS client_monthly_income DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS coapplicant_monthly_income DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS other_monthly_income DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS monthly_personal_expenses DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS monthly_business_expenses DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS monthly_other_obligations DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS purpose TEXT;

-- Add comment explaining these are legacy/simplified fields
COMMENT ON COLUMN applications.client_monthly_income IS 'Simplified field - see income_* fields for detailed breakdown';
COMMENT ON COLUMN applications.monthly_personal_expenses IS 'Simplified field - see expenses_* fields for detailed breakdown';
COMMENT ON COLUMN applications.monthly_business_expenses IS 'Simplified field - see business expense fields for detailed breakdown';
