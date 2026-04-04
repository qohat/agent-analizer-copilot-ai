-- Add RLS policies for users table
-- Date: 2026-04-04
-- Purpose: Allow authenticated users to read their own profile

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid()::text);

-- Policy: Service role can do anything (for admin operations)
CREATE POLICY "Service role has full access to users"
  ON users
  TO service_role
  USING (true)
  WITH CHECK (true);
