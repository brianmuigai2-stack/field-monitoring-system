#!/bin/bash

# SmartSeason Field Monitoring System - Setup Script
echo "Setting up SmartSeason Field Monitoring System..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Create database
echo "Creating PostgreSQL database..."
sudo -u postgres createdb smartseason 2>/dev/null || echo "Database already exists"

# Import database schema
echo "Setting up database schema..."
sudo -u postgres psql -d smartseason -f backend/database/init.sql

# Set PostgreSQL password
echo "Setting PostgreSQL password..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" 2>/dev/null

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../SmartSeason-frontend
npm install

echo ""
echo "Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Backend server: cd backend && npm run dev"
echo "2. Frontend server: cd SmartSeason-frontend && npm run dev"
echo ""
echo "Demo Credentials:"
echo "- Admin: admin@smartseason.com / password"
echo "- Agent: agent1@smartseason.com / password"
echo ""
echo "Application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:5000"
