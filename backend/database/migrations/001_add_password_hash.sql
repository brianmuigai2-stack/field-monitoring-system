-- Add missing password_hash column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Handle case where column might be named hashed_password instead
DO $$
BEGIN
  -- Check if hashed_password column exists and password_hash doesn't
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'hashed_password'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    -- Rename hashed_password to password_hash
    ALTER TABLE users RENAME COLUMN hashed_password TO password_hash;
  END IF;
END $$;

-- Ensure password_hash column is NOT NULL and has a default if it's still nullable
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';

-- Convert enum-based role to VARCHAR if needed
DO $$
DECLARE
  col_typname text;
BEGIN
  SELECT t.typname INTO col_typname
  FROM pg_attribute a
  JOIN pg_type t ON a.atttypid = t.oid
  WHERE a.attrelid = 'users'::regclass
    AND a.attname = 'role'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF col_typname = 'userrole' THEN
    ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(20) USING role::text;
    DROP TYPE userrole;
  END IF;
END $$;

-- Normalize any unexpected role values to 'field_agent'
UPDATE users SET role = 'field_agent' WHERE role NOT IN ('admin', 'field_agent');

-- Drop any stale check constraint (new schema uses plain VARCHAR, constraint not needed)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Ensure there is a unique index on fields.name for upsert support
CREATE UNIQUE INDEX IF NOT EXISTS idx_fields_name_unique ON fields(name);

