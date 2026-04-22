-- This file will be executed automatically by Render on database creation
-- It creates the base tables only. Seed data is applied by the app's init script.

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
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

