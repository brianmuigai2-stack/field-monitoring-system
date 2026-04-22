-- Add password_hash column to users table
-- This migration fixes the missing column error

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Update any existing rows with a placeholder (they'll need to be updated via the app)
-- Note: Existing users from the initial seed may have invalid passwords now
