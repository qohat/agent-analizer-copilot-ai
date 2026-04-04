-- Seed data for development
-- Run this to create test users and institutions

-- Insert test institution (if not exists)
INSERT INTO institutions (id, name, country, max_commercial_amount, max_agricultural_amount, min_monthly_income, default_rate, default_months)
VALUES (
  'dev-institution-1',
  'Development Institution',
  'CO',
  50000000,
  100000000,
  800000,
  0.025,
  12
)
ON CONFLICT (id) DO NOTHING;

-- Insert test advisor user (if not exists)
-- Note: In production, users would be in auth.users table
-- For development, we'll just ensure the IDs are valid
INSERT INTO institutions (id, name, country, max_commercial_amount, max_agricultural_amount, min_monthly_income, default_rate, default_months)
VALUES (
  'dev-institution-2',
  'Test Bank',
  'CO',
  100000000,
  200000000,
  1000000,
  0.02,
  24
)
ON CONFLICT (id) DO NOTHING;

-- Note: Advisors are typically in auth.users, but for bypass auth we just need valid institution_id
-- The application will work with institution_id: 'dev-institution-1' or 'dev-institution-2'
