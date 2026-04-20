-- Create database schema for SmartSeason Field Monitoring System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'field_agent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    planting_date DATE NOT NULL,
    current_stage VARCHAR(20) NOT NULL CHECK (current_stage IN ('planted', 'growing', 'ready', 'harvested')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'at_risk', 'completed')),
    assigned_agent_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field updates table
CREATE TABLE IF NOT EXISTS field_updates (
    id SERIAL PRIMARY KEY,
    field_id INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
    agent_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage VARCHAR(20) NOT NULL CHECK (stage IN ('planted', 'growing', 'ready', 'harvested')),
    notes TEXT,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fields_agent_id ON fields(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_field_updates_field_id ON field_updates(field_id);
CREATE INDEX IF NOT EXISTS idx_field_updates_agent_id ON field_updates(agent_id);

-- Insert sample data for testing
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('agent1', 'agent1@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_agent'),
('agent2', 'agent2@smartseason.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'field_agent')
ON CONFLICT (username) DO NOTHING;

-- Insert sample fields
INSERT INTO fields (name, crop_type, planting_date, current_stage, status, assigned_agent_id) VALUES
('North Field', 'Corn', '2024-03-15', 'growing', 'active', 2),
('South Field', 'Wheat', '2024-03-20', 'ready', 'active', 2),
('East Field', 'Soybeans', '2024-03-10', 'harvested', 'completed', 3),
('West Field', 'Corn', '2024-04-01', 'planted', 'at_risk', 3)
ON CONFLICT DO NOTHING;
