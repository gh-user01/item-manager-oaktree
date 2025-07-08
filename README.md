# Item Manager - Full Stack Application

A complete full-stack web application for managing items with a Flask REST API backend and Next.js frontend. Features robust JWT authentication, comprehensive testing, and modern development practices.

## Project Structure

```
item-manager-oaktree/
├── backend/                 # Flask REST API
│   ├── app/                # Application factory structure
│   │   ├── __init__.py     # App factory
│   │   ├── config.py       # Configuration classes
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication routes
│   │   ├── models/         # Database models
│   │   └── utils/          # Utilities and validators
│   ├── tests/              # Pytest test suite
│   ├── venv/               # Virtual environment (created after setup)
│   ├── run.py              # Application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── seed_data.py        # Sample data script
│   ├── pytest.ini         # Pytest configuration
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
│   └── .gitignore         # Git ignore file
├── .gitignore              # Root git ignore file
└── README.md               # This file
```

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

### Frontend (Next.js)
- ✅ **Modern React**: Next.js 15 with App Router and React 19
- ✅ **Route Groups**: Organized auth and dashboard routes
- ✅ **Authentication**: Complete JWT-based auth with context
- ✅ **Protected Routes**: Route-level access control
- ✅ **TypeScript**: Full type safety throughout
- ✅ **Responsive Design**: Works on all devices
- ✅ **Form Handling**: Validation and error states
- ✅ **Testing Suite**: 26 Jest tests covering components, pages, and utilities
- ✅ **Clean UI**: Intuitive interface with loading states

### Testing
- ✅ **Backend Tests**: 10 pytest tests (100% passing)
- ✅ **Frontend Tests**: 26 Jest tests (100% passing)
- ✅ **Coverage**: All major components and functionality tested
- ✅ **CI Ready**: Simple test commands for assessment

## Quick Start

### Prerequisites
- Python 3.7+ 
- Node.js 16+
- npm or yarn

### 1. Start the Backend

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

# Run the application
python run.py
```

The API will be running at `http://localhost:8000`

### 2. Seed Sample Data (Optional)

```bash
# Make sure you're in the backend directory with virtual environment activated
cd backend
# Activate virtual environment if not already active
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Seed users and sample items
python seed_data.py
```

This creates test accounts:
- **Email:** john@example.com | **Password:** password123
- **Email:** jane@example.com | **Password:** password123

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The web application will be available at `http://localhost:3000`

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user and get tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| DELETE | `/api/auth/logout` | Logout and blacklist token |
| GET | `/api/auth/me` | Get current user info |

### Item Endpoints
| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/items` | Get all items | Public |
| GET | `/api/items/<id>` | Get a specific item | Public |
| POST | `/api/items` | Create a new item | Required |
| PUT | `/api/items/<id>` | Update an item | Required |
| DELETE | `/api/items/<id>` | Delete an item | Required |

## Frontend Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/(dashboard)/page.tsx` | Home page with all items |
| `/login` | `app/(auth)/login/page.tsx` | User login form |
| `/signup` | `app/(auth)/signup/page.tsx` | User registration form |
| `/create-item` | `app/(dashboard)/create-item/page.tsx` | Form to create a new item |
| `/item/[id]` | `app/(dashboard)/item/[id]/page.tsx` | Item detail with edit/delete options |

## Testing

### Backend Tests
```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Run tests
pytest
```

**Coverage**: 10 tests covering authentication, item CRUD, and error handling

### Frontend Tests
```bash
cd frontend
npm test
```

**Coverage**: 26 tests covering all components, pages, contexts, and utilities

## Data Model

Each item contains:
- `id`: Unique identifier (auto-generated)
- `name`: Item name (required)
- `description`: Item description (optional)
- `price`: Item price in dollars (required, must be positive)

## Development

### Backend Development
- **App Factory Pattern**: Modular Flask application structure
- **Blueprint Organization**: Separate auth and API routes
- **Environment-based Config**: Development, testing, and production configs
- **Database Models**: Clean ORM-like model classes
- **Comprehensive Testing**: pytest suite with fixtures and database handling

### Frontend Development
- **Next.js 15**: Latest App Router with React 19
- **Route Groups**: Organized authentication and dashboard routes
- **TypeScript**: Full type safety with strict configuration
- **Context API**: Global state management for authentication
- **Jest Testing**: Comprehensive test suite with Testing Library
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Architecture Highlights

### Backend Architecture
- **Flask App Factory**: Scalable application structure
- **Blueprint Separation**: Auth and API routes in separate modules
- **Model Layer**: Database models with validation
- **JWT Implementation**: Secure token-based authentication
- **Error Handling**: Consistent error responses
- **Testing**: Unit and integration tests with pytest

### Frontend Architecture
- **Route Groups**: `(auth)` and `(dashboard)` for organization
- **Context Providers**: Authentication state management
- **Component Structure**: Reusable UI components
- **API Layer**: Centralized API service with token management
- **Testing Strategy**: Component, integration, and utility tests

## Production Deployment

### Backend
1. Set environment variables for production
2. Use a production WSGI server like Gunicorn
3. Consider using PostgreSQL instead of SQLite

### Frontend
1. Build the production version: `npm run build`
2. Start with: `npm start`
3. Deploy to platforms like Vercel, Netlify, or AWS

## Technologies Used

### Backend
- **Flask** - Web framework with app factory pattern
- **Flask-JWT-Extended** - JWT token management
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Database with custom ORM layer
- **pytest** - Testing framework
- **Python 3.11** - Programming language

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Jest** - Testing framework
- **Testing Library** - React testing utilities
- **Native Fetch API** - HTTP client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and demonstration of full-stack development skills.
