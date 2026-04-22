-- Add password_hash column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Convert role column from enum (userrole) to VARCHAR if needed, then enforce allowed values
DO $$
DECLARE
  col_typname text;
BEGIN
  -- Get the actual PostgreSQL type name of the role column
  SELECT t.typname INTO col_typname
  FROM pg_attribute a
  JOIN pg_type t ON a.atttypid = t.oid
  WHERE a.attrelid = 'users'::regclass
    AND a.attname = 'role'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  -- If the column is of an enum type (specifically 'userrole'), convert to VARCHAR
  IF col_typname = 'userrole' THEN
    ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(20) USING role::text;
  END IF;
END $$;

-- Ensure the check constraint only allows valid roles
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('admin', 'field_agent'));
