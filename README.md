# Item Manager - Full Stack Application

A complete full-stack web application for managing items with a Flask REST API backend and Next.js frontend.

## Project Structure

```
item-manager-oaktree/
├── backend/                 # Flask REST API
│   ├── venv/               # Virtual environment (created after setup)
│   ├── main.py             # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── seed_data.py        # Sample data script
│   ├── .gitignore         # Git ignore file
│   └── README.md           # Backend documentation
├── frontend/               # Next.js React application (App Router)
│   ├── app/                # App Router pages and layouts
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page (/)
│   │   ├── create-item/    # Create item page (/create-item)
│   │   └── item/[id]/      # Item detail page (/item/[id])
│   ├── components/         # React components
│   ├── lib/                # API service and utilities
│   ├── node_modules/       # Dependencies (created after npm install)
│   ├── package.json        # Node.js dependencies
│   ├── .gitignore         # Git ignore file
│   └── README.md           # Frontend documentation
├── .gitignore              # Root git ignore file
└── README.md               # This file
```

## Features

### Backend (Flask API)
- ✅ RESTful API with full CRUD operations
- ✅ SQLite database with automatic table creation
- ✅ Input validation and error handling
- ✅ CORS support for frontend integration
- ✅ Clean, documented code structure

### Frontend (Next.js)
- ✅ Modern React/Next.js application with App Router
- ✅ Responsive design that works on all devices
- ✅ TypeScript for type safety
- ✅ Form validation and error handling
- ✅ Loading states and user feedback
- ✅ Clean, intuitive user interface
- ✅ Global error boundaries and 404 pages

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
python main.py
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

python seed_data.py
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The web application will be available at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| POST | `/api/items` | Create a new item |
| GET | `/api/items/<id>` | Get a specific item |
| PUT | `/api/items/<id>` | Update an item |
| DELETE | `/api/items/<id>` | Delete an item |

## Frontend Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page with all items |
| `/create-item` | `app/create-item/page.tsx` | Form to create a new item |
| `/item/[id]` | `app/item/[id]/page.tsx` | Item detail with edit/delete options |

## Data Model

Each item contains:
- `id`: Unique identifier (auto-generated)
- `name`: Item name (required)
- `description`: Item description (optional)
- `price`: Item price in dollars (required, must be positive)

## Development

### Backend Development
- Use virtual environment to isolate dependencies
- The Flask app runs in debug mode for development
- Database file (`items.db`) is created automatically
- API supports hot-reloading during development
- Virtual environment keeps project dependencies separate

### Frontend Development
- Next.js provides hot-reloading with App Router
- TypeScript ensures type safety
- Tailwind CSS v4 provides utility-first styling for consistent design
- Simple, functional UI components with responsive design
- Global error boundaries and loading states

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
- Flask - Web framework
- SQLite - Database
- flask-cors - CORS support

### Frontend
- Next.js - React framework with App Router
- TypeScript - Type safety
- Native Fetch API - HTTP client
- Tailwind CSS v4 - Utility-first CSS framework

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes and demonstration of full-stack development skills.
