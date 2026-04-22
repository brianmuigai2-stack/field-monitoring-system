-- Seed data for testing/development
-- Uses UPSERT to ensure seeded users have correct credentials/roles

-- First, ensure password_hash column exists and is properly configured
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NOT NULL DEFAULT '';
  END IF;
  
  -- Clean up any null password hashes
  UPDATE users SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
  WHERE password_hash IS NULL OR password_hash = '';
END $$;

-- Upsert seeded users with explicit column handling
INSERT INTO users (username, email, password_hash, role)
VALUES 
  ('admin', 'admin@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('agent1', 'agent1@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_agent'),
  ('agent2', 'agent2@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_agent')
ON CONFLICT (username) DO UPDATE 
  SET email = EXCLUDED.email,
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role;

-- Upsert seeded fields; look up agent IDs by username for robustness
INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id)
SELECT v.name, v.crop_type, v.planting_date, v.current_stage, v.status, v.assigned_agent_id
FROM (VALUES
  ('North Field', 'Corn',   '2024-03-15', 'growing',  'active',  (SELECT id FROM users WHERE username = 'agent1')),
  ('South Field', 'Wheat',  '2024-03-20', 'ready',    'active',  (SELECT id FROM users WHERE username = 'agent1')),
  ('East Field',  'Soybeans','2024-03-10', 'harvested','completed',(SELECT id FROM users WHERE username = 'agent2')),
  ('West Field',  'Corn',   '2024-04-01', 'planted',  'at_risk', (SELECT id FROM users WHERE username = 'agent2'))
) AS v(name, crop_type, planting_date, current_stage, status, assigned_agent_id)
ON CONFLICT (name) DO UPDATE 
  SET crop_type = EXCLUDED.crop_type,
      planting_date = EXCLUDED.planting_date,
      current_stage = EXCLUDED.current_stage,
      status = EXCLUDED.status,
      assigned_agent_id = EXCLUDED.assigned_agent_id;
