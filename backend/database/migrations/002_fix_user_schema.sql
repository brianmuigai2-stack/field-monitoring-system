-- Fix user schema to ensure consistent column structure
DO $$
BEGIN
  -- Drop any remaining hashed_password column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'hashed_password'
  ) THEN
    -- Copy data to password_hash if needed
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN
      UPDATE users SET password_hash = COALESCE(password_hash, hashed_password) WHERE password_hash IS NULL OR password_hash = '';
    END IF;
    ALTER TABLE users DROP COLUMN hashed_password;
  END IF;
  
  -- Ensure password_hash exists and is properly configured
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';
  END IF;
  
  -- Clean up any existing users with null passwords
  UPDATE users SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
  WHERE password_hash IS NULL OR password_hash = '';
END $$;

-- Ensure proper constraints
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET DEFAULT '';
