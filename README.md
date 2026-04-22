# SmartSeason Field Monitoring System

A full-stack web application for tracking crop progress across multiple fields during a growing season. Built with Node.js, Express, PostgreSQL, and React.

## Overview

SmartSeason helps agricultural coordinators and field agents monitor crop development through a simple, intuitive interface. The system supports role-based access control, real-time field status tracking, and comprehensive update management.

## Features

### User Management
- **Role-based Authentication**: Admin (Coordinator) and Field Agent roles
- **Secure Login/Registration**: JWT-based authentication with bcrypt password hashing
- **Access Control**: Role-specific permissions for different features

### Field Management
- **CRUD Operations**: Create, read, update, and delete fields (Admin only)
- **Field Assignment**: Assign fields to specific field agents
- **Field Information**: Track name, crop type, planting date, and current stage

### Field Stages
- **Growth Lifecycle**: Planted -> Growing -> Ready -> Harvested
- **Stage Updates**: Field agents can update field stages with observations
- **Update History**: Complete audit trail of all field changes

### Status Logic
The system automatically calculates field status based on days since planting:

| Stage | Threshold | Status |
|-------|-----------|--------|
| Planted | > 30 days | At Risk |
| Growing | > 120 days | At Risk |
| Ready | > 150 days | At Risk |
| Harvested | Any | Completed |
| Other | Normal | Active |

### Dashboard Analytics
- **Admin View**: Overview of all fields, agent assignments, and system statistics
- **Agent View**: Personal dashboard showing assigned fields and update history
- **Real-time Stats**: Field counts by stage and status

## Technical Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js with middleware for CORS and JSON parsing
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Design**: RESTful endpoints with proper error handling

### Frontend (React + Vite)
- **Framework**: React 19 with hooks for state management
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS with custom utility classes
- **HTTP Client**: Axios with request/response interceptors
- **Icons**: Lucide React for consistent iconography

### Database Schema
```sql
Users (id, username, email, password_hash, role)
Fields (id, name, crop_type, planting_date, current_stage, status, assigned_agent_id)
Field_Updates (id, field_id, agent_id, stage, notes, update_date)
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone git@github.com:brianmuigai2-stack/field-monitoring-system.git
cd field-monitoring-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../SmartSeason-frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb smartseason

# Import the database schema
psql -d smartseason -f backend/database/init.sql
```

### 3. Environment Configuration

Copy the example environment files and configure them:

```bash
# Backend
cp .env.example backend/.env

# Frontend  
cp SmartSeason-frontend/.env.example SmartSeason-frontend/.env
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartseason
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

Create a `.env` file in the `SmartSeason-frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application

```bash
# Start the backend server (from backend directory)
npm run dev

# Start the frontend development server (from SmartSeason-frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Demo Credentials

### Admin Account
- **Email**: admin@smartseason.com
- **Password**: password

### Field Agent Account
- **Email**: agent1@smartseason.com
- **Password**: password

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Fields
- `GET /api/fields` - Get all fields (admin) or assigned fields (agent)
- `GET /api/fields/:id` - Get specific field
- `POST /api/fields` - Create new field (admin only)
- `PUT /api/fields/:id` - Update field (admin only)
- `DELETE /api/fields/:id` - Delete field (admin only)
- `PUT /api/fields/:id/stage` - Update field stage
- `GET /api/fields/:id/updates` - Get field updates
- `GET /api/fields/stats/dashboard` - Get dashboard statistics

### Users
- `GET /api/users/agents` - Get all field agents (admin only)

## Design Decisions

### 1. Status Logic Implementation
The field status is calculated dynamically based on the current stage and time elapsed since planting:
- **Planted > 30 days**: At Risk (should be growing by now)
- **Growing > 120 days**: At Risk (taking too long to mature)
- **Ready > 150 days**: At Risk (should be harvested)
- **Harvested**: Completed (final state)

This approach provides automated risk detection while allowing manual intervention through stage updates.

### 2. Role-Based Access Control
- **Admin**: Full access to all fields, can create/assign fields, view all updates
- **Field Agent**: Can only view assigned fields, update stages, and add observations

### 3. Database Design
- **Normalized Schema**: Separate tables for users, fields, and updates to avoid data duplication
- **Foreign Key Constraints**: Ensure data integrity between related entities
- **Indexes**: Optimized for common query patterns (agent assignments, field lookups)

### 4. Frontend Architecture
- **Component-Based**: Modular React components for reusability
- **Context API**: Centralized authentication state management
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Error Handling**: User-friendly error messages and loading states

### 5. Security Considerations
- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Stateless authentication with expiration
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## Assumptions Made

### At-Risk Status Rules
The system automatically calculates field status based on days since planting date:

| Stage | Days Since Planting | Status | Reason |
|-------|----------------|--------|-------|
| Planted | > 30 days | At Risk | Not progressing to growing stage |
| Growing | > 120 days | At Risk | Taking too long to mature |
| Ready | > 150 days | At Risk | Should be harvested |
| Harvested | Any | Completed | Final state |
| Any (normal) | Within threshold | Active | Normal progression |

1. **Time-Based Status**: The risk assessment logic assumes typical crop growth timelines. These thresholds can be adjusted based on specific crop requirements in `backend/routes/fields.js`.

2. **Single Agent Assignment**: Each field is assigned to exactly one field agent for clear responsibility.

3. **Sequential Stage Progression**: Fields progress through stages in order (Planted -> Growing -> Ready -> Harvested).

4. **Local Development**: The setup assumes local PostgreSQL installation. For production, consider cloud database solutions.

5. **Basic Notifications**: The system doesn't include email notifications but can be extended to add alerts for at-risk fields.

## Future Enhancements

1. **Email Notifications**: Automated alerts for at-risk fields
2. **Mobile App**: Native mobile application for field agents
3. **Advanced Analytics**: Historical data analysis and trend reporting
4. **Image Upload**: Visual field documentation with photos
5. **Weather Integration**: Weather data integration for better risk assessment
6. **Multi-Tenant Support**: Support for multiple farms/organizations

## Testing

The application includes:
- **API Testing**: Manual testing through Postman or similar tools
- **Frontend Testing**: User interface testing through browser
- **Integration Testing**: End-to-end workflow verification

## Deployment

### Option 1: Deploy to Vercel (Frontend) + Render (Backend)

#### Backend Deployment (Render/Railway)

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com/) or [Railway](https://railway.app/)
3. Connect your GitHub repository
4. Configure the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     PORT=5000
     DB_HOST=your-postgres-host
     DB_PORT=5432
     DB_NAME=smartseason
     DB_USER=your-db-user
     DB_PASSWORD=your-db-password
     JWT_SECRET=your-secure-secret-key
     ```
5. Create a PostgreSQL database on the same platform
6. Run the database schema:
   ```sql
   -- Create tables (see backend/database/init.sql)
   ```

#### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Or deploy directly from [Vercel](https://vercel.com/)
3. Configure environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
4. For production, update `src/services/api.js` to use the production API URL

#### Alternative: Deploy Both on Render

1. Create a Render account
2. Deploy backend as a Web Service
3. Deploy frontend as a Static Site with publish directory as `dist`
4. Add redirect rule for SPA: `/` → `/index.html`

### Option 2: Docker Deployment

Create a `Dockerfile` in the root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./backend/
COPY SmartSeason-frontend/package*.json ./SmartSeason-frontend/

RUN cd backend && npm install
RUN cd SmartSeason-frontend && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd SmartSeason-frontend && npm run build

# Expose ports
EXPOSE 5000

# Start backend
CMD ["cd", "backend", "npm", "start"]
```

### Quick Deploy Links

- **Vercel Frontend**: Deploy directly from GitHub
- **Render Backend**: https://render.com/docs/deploy-node-express
- **Railway**: https://railway.app/

## Support

For issues or questions, please refer to the code documentation or contact the development team.
