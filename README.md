# Item Manager - Full Stack Application

A complete full-stack web application for managing items with a Flask REST API backend and Next.js frontend. Features robust JWT authentication, comprehensive testing, and modern development practices.

## Overview

This application demonstrates modern full-stack development practices with a clean separation of concerns between frontend and backend. The system allows users to manage items with full CRUD operations, secure authentication, and a responsive user interface.

## Technical Approach

### Architecture Decision
- **Monorepo Structure**: Both frontend and backend are housed in a single repository for easier development and deployment coordination
- **Microservices Ready**: Despite being in a monorepo, the services are completely decoupled and can be deployed independently
- **API-First Design**: Backend exposes a clean REST API that can be consumed by any frontend or mobile application

### Backend Architecture
- **Flask App Factory Pattern**: Modular design allowing for easy testing and configuration management
- **Blueprint Organization**: Separate blueprints for authentication and API routes for better code organization
- **JWT Authentication**: Stateless authentication with refresh tokens for enhanced security
- **SQLite Database**: Lightweight database for development with easy migration path to PostgreSQL for production

### Frontend Architecture
- **Next.js App Router**: Modern React framework with file-based routing and server-side capabilities
- **Route Groups**: Organized routes with `(auth)` and `(dashboard)` groups for better code structure
- **Context API**: Global state management for authentication without external dependencies
- **TypeScript**: Full type safety throughout the application

## Key Assumptions

### Development Environment
- **Python 3.7+**: Modern Python version with async support
- **Node.js 16+**: Required for Next.js 15 compatibility
- **SQLite**: Suitable for development and small-scale production
- **Local Development**: Both services run locally during development

### Security Assumptions
- **JWT Tokens**: Access tokens expire in 15 minutes, refresh tokens in 7 days
- **CORS**: Configured for specific domains to prevent unauthorized access
- **Password Storage**: Passwords are hashed using secure algorithms
- **HTTPS**: Production deployment assumes HTTPS for secure token transmission

### Data Model Assumptions
- **Item Structure**: Simple item model with name, description, and price
- **User Model**: Basic user authentication with email and password
- **No File Uploads**: Items are text-based only for simplicity
- **Single User Items**: Each item belongs to the creating user

### Deployment Assumptions
- **Cloud Deployment**: Designed for Render (backend) and Vercel (frontend)
- **Environment Variables**: Secrets managed through platform-specific environment variables
- **Database Persistence**: SQLite file persists in deployed environment
- **Database Reset**: Database is reset on each deployment (ephemeral storage)
- **Demo Data**: Default demo user and sample items are created automatically
- **Free Tier Limitations**: Backend may spin down due to inactivity (50+ second delay on first request)
- **Monitoring**: Basic health checks for production monitoring

## Important Notes

### Database Behavior
- **Development**: SQLite database persists between runs
- **Production**: Database resets on each deployment (ephemeral storage)
- **Demo Data**: Demo user and sample items are automatically created on each deployment
- **User Data**: Any user-created data will be lost on redeployment

### Demo Account
The application automatically creates a demo account for immediate testing:
- **Email:** demo@example.com
- **Password:** demo123

This account is recreated on every deployment, ensuring it's always available for testing.

## Free Tier Limitations
- **Backend Cold Starts**: On Render's free tier, the backend service spins down after periods of inactivity
- **Startup Delay**: First request after inactivity may take 50+ seconds to respond
- **User Experience**: Subsequent requests are fast once the service is warmed up

## Project Structure

```
item-manager-oaktree/
├── backend/                 # Flask REST API
│   ├── app/                # Application factory structure
│   │   ├── __init__.py     # App factory
│   │   ├── config.py       # Configuration classes (production-ready)
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication routes
│   │   ├── models/         # Database models
│   │   └── utils/          # Utilities and validators
│   ├── tests/              # Pytest test suite
│   ├── venv/               # Virtual environment (created after setup)
│   ├── run.py              # Application entry point
│   ├── requirements.txt    # Python dependencies (includes Gunicorn)
│   ├── seed_data.py        # Sample data script
│   ├── pytest.ini         # Pytest configuration
│   ├── Procfile           # Gunicorn configuration for Render
│   ├── runtime.txt        # Python version for Render
│   ├── .env.example       # Environment variables template
│   └── .gitignore         # Git ignore file
├── frontend/               # Next.js React application (App Router)
│   ├── src/                # Source code
│   │   ├── app/            # App Router pages with route groups
│   │   │   ├── (auth)/     # Authentication pages (login, signup)
│   │   │   ├── (dashboard)/ # Protected dashboard pages
│   │   │   ├── layout.tsx  # Root layout
│   │   │   ├── globals.css # Global styles
│   │   │   └── loading.tsx # Loading UI
│   │   ├── components/     # React components
│   │   ├── contexts/       # React Context providers
│   │   ├── lib/            # API service and utilities
│   │   └── __tests__/      # Jest test suite
│   ├── public/             # Static assets
│   ├── jest.config.js      # Jest configuration
│   ├── jest.setup.js       # Jest setup file
│   ├── package.json        # Node.js dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   ├── .env.example        # Environment variables template
│   ├── .npmrc              # NPM configuration for peer deps
│   └── .gitignore         # Git ignore file
├── render.yaml             # Render Blueprint deployment config
├── .gitignore              # Root git ignore file
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Python 3.7+ 
- Node.js 16+
- npm or yarn
- Git

### Complete Setup (Recommended)

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd item-manager-oaktree
   ```

2. **Backend Setup**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Copy environment variables
   cp .env.example .env
   
   # Run the application
   python run.py
   ```
   
   The API will be running at `http://localhost:8000`

3. **Frontend Setup (New Terminal)**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Copy environment variables
   cp .env.example .env.local
   
   # Start development server
   npm run dev
   ```
   
   The web application will be available at `http://localhost:3000`

### Seed Sample Data (Optional)

```bash
# Make sure you're in the backend directory with virtual environment activated
cd backend
python seed_data.py
```

This creates test accounts:
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123

## Features

### Backend (Flask API)
- ✅ **Modular Architecture**: Flask app factory pattern with blueprints
- ✅ **JWT Authentication**: Complete auth system with refresh tokens
- ✅ **RESTful API**: Full CRUD operations with proper HTTP methods
- ✅ **Database Models**: SQLite with ORM-like model classes
- ✅ **Input Validation**: Comprehensive data validation and error handling
- ✅ **CORS Support**: Configured for frontend integration
- ✅ **Testing Suite**: 10 pytest tests covering all endpoints
- ✅ **Clean Code**: Well-documented, maintainable structure
- ✅ **Production Ready**: Configured for Render deployment with Gunicorn

### Frontend (Next.js)
- ✅ **Modern React**: Next.js 15 with App Router and React 18
- ✅ **Route Groups**: Organized auth and dashboard routes
- ✅ **Authentication**: Complete JWT-based auth with context
- ✅ **Protected Routes**: Route-level access control
- ✅ **TypeScript**: Full type safety throughout
- ✅ **Responsive Design**: Works on all devices
- ✅ **Form Handling**: Validation and error states
- ✅ **Testing Suite**: 26 Jest tests covering components, pages, and utilities
- ✅ **Clean UI**: Intuitive interface with loading states
- ✅ **Production Ready**: Configured for Vercel deployment

### Testing
- ✅ **Backend Tests**: 10 pytest tests (100% passing)
- ✅ **Frontend Tests**: 26 Jest tests (100% passing)
- ✅ **Coverage**: All major components and functionality tested
- ✅ **CI Ready**: Simple test commands for assessment

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | `{email, password, name}` |
| POST | `/api/auth/login` | Login user and get tokens | `{email, password}` |
| POST | `/api/auth/refresh` | Refresh access token | Header: `Authorization: Bearer <refresh_token>` |
| DELETE | `/api/auth/logout` | Logout and blacklist token | Header: `Authorization: Bearer <access_token>` |
| GET | `/api/auth/me` | Get current user info | Header: `Authorization: Bearer <access_token>` |

### Item Endpoints
| Method | Endpoint | Description | Authentication | Body |
|--------|----------|-------------|----------------|------|
| GET | `/api/items` | Get all items | Required | - |
| GET | `/api/items/<id>` | Get a specific item | Required | - |
| POST | `/api/items` | Create a new item | Required | `{name, description, price}` |
| PUT | `/api/items/<id>` | Update an item | Required | `{name?, description?, price?}` |
| DELETE | `/api/items/<id>` | Delete an item | Required | - |

## Frontend Pages

| Route | File | Description | Authentication |
|-------|------|-------------|----------------|
| `/` | `app/(dashboard)/page.tsx` | Home page with all items | Required |
| `/login` | `app/(auth)/login/page.tsx` | User login form | Public |
| `/signup` | `app/(auth)/signup/page.tsx` | User registration form | Public |
| `/create-item` | `app/(dashboard)/create-item/page.tsx` | Form to create a new item | Required |
| `/item/[id]` | `app/(dashboard)/item/[id]/page.tsx` | Item detail with edit/delete | Required |

## Testing

### Backend Tests
```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run tests
pytest

# Run tests with coverage
pytest --cov=app
```

**Coverage**: 10 tests covering authentication, item CRUD, and error handling

### Frontend Tests
```bash
cd frontend
npm test

# Run tests in watch mode
npm run test:watch
```

**Coverage**: 26 tests covering all components, pages, contexts, and utilities

## Data Model

### User Model
```python
{
    "id": int,          # Auto-generated primary key
    "email": str,       # Unique email address
    "password": str,    # Hashed password
    "name": str,        # User's display name
    "created_at": str   # ISO timestamp
}
```

### Item Model
```python
{
    "id": int,          # Auto-generated primary key
    "name": str,        # Item name (required)
    "description": str, # Item description (optional)
    "price": float,     # Item price in dollars (required, > 0)
    "created_at": str   # ISO timestamp
}
```

## Development Workflow

### Backend Development
1. **Environment Setup**: Virtual environment with all dependencies
2. **Database**: SQLite file created automatically on first run
3. **Testing**: Run pytest before committing changes
4. **Code Style**: Follow PEP 8 guidelines
5. **Configuration**: Environment-based config for different stages

### Frontend Development
1. **Environment Setup**: Node.js dependencies with npm/yarn
2. **Development Server**: Hot reload with Next.js dev server
3. **Testing**: Jest tests with React Testing Library
4. **TypeScript**: Strict type checking enabled
5. **Styling**: Tailwind CSS with responsive design

## Production Deployment

### Backend (Render)

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after spin-down may take 50+ seconds
- Subsequent requests are fast once service is warmed up

### Frontend (Vercel)

### Deployment Process
1. **Push to GitHub**: All changes committed and pushed
2. **Backend**: Automatically deploys to Render via render.yaml
3. **Frontend**: Automatically deploys to Vercel
4. **Environment Variables**: Set in respective platform dashboards
5. **CORS Configuration**: Update backend CORS_ORIGINS with frontend URL
6. **First Request**: May be slow due to cold start (free tier limitation)

## Technologies Used

### Backend
- **Flask** - Web framework with app factory pattern
- **Flask-JWT-Extended** - JWT token management
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Database with custom ORM layer
- **pytest** - Testing framework
- **Python 3.11** - Programming language
- **Gunicorn** - Production WSGI server

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Jest** - Testing framework
- **Testing Library** - React testing utilities
- **Native Fetch API** - HTTP client

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 8000 (backend)
   npx kill-port 8000
   
   # Kill process on port 3000 (frontend)
   npx kill-port 3000
   ```

2. **Virtual Environment Issues**
   ```bash
   # Recreate virtual environment
   cd backend
   rm -rf venv
   python -m venv venv
   ```

3. **Database Issues**
   ```bash
   # Reset database
   cd backend
   rm items.db
   python run.py  # Creates new database
   ```

4. **Node Dependencies**
   ```bash
   # Clear and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## License

This project is for educational purposes and demonstration of full-stack development skills.
