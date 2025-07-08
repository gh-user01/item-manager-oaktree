import pytest
import tempfile
import os
from app import create_app
from app.utils.database import init_db


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary file for test database
    db_fd, db_path = tempfile.mkstemp()
    
    # Create app with testing configuration
    app = create_app('testing')
    app.config['DATABASE_PATH'] = db_path
    app.config['TESTING'] = True
    
    # Initialize database within app context
    with app.app_context():
        init_db()
    
    yield app
    
    # Clean up
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def auth_token(client):
    """Get authentication token for testing."""
    # Register a user
    register_response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123',
        'name': 'Test User'
    })
    
    # Check if registration was successful
    if register_response.status_code != 201:
        print(f"Registration failed: {register_response.status_code}")
        print(f"Response data: {register_response.get_json()}")
        return None
    
    # Login the user
    login_response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    
    # Check if login was successful
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(f"Response data: {login_response.get_json()}")
        return None
    
    login_data = login_response.get_json()
    if 'access_token' not in login_data:
        print(f"No access_token in response: {login_data}")
        return None
        
    return login_data['access_token']
