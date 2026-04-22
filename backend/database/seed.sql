-- Seed data for testing/development
-- Only inserts if no users exist (safe for repeated runs)

INSERT INTO users (username, email, password_hash, role)
SELECT 'admin', 'admin@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, email, password_hash, role)
SELECT 'agent1', 'agent1@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_agent'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'agent1');

INSERT INTO users (username, email, password_hash, role)
SELECT 'agent2', 'agent2@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_agent'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'agent2');

-- Insert sample fields (only if none exist)
INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id)
SELECT 'North Field', 'Corn', '2024-03-15', 'growing', 'active', 2
WHERE NOT EXISTS (SELECT 1 FROM fields);

INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id)
SELECT 'South Field', 'Wheat', '2024-03-20', 'ready', 'active', 2
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'South Field');

INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id)
SELECT 'East Field', 'Soybeans', '2024-03-10', 'harvested', 'completed', 3
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'East Field');

INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id)
SELECT 'West Field', 'Corn', '2024-04-01', 'planted', 'at_risk', 3
WHERE NOT EXISTS (SELECT 1 FROM fields WHERE name = 'West Field');
