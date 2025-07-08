import pytest


def test_app_runs(client):
    """Test that the app starts and health check works."""
    response = client.get('/')
    assert response.status_code == 200
    assert 'Item Manager API is running!' in response.get_json()['message']


def test_user_registration(client):
    """Test user can register."""
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'password123',
        'name': 'Test User'
    })
    
    assert response.status_code == 201
    data = response.get_json()
    assert 'access_token' in data
    assert data['user']['email'] == 'test@example.com'


def test_user_login(client):
    """Test user can login after registration."""
    # Register first
    client.post('/api/auth/register', json={
        'email': 'login@example.com',
        'password': 'password123',
        'name': 'Login User'
    })
    
    # Then login
    response = client.post('/api/auth/login', json={
        'email': 'login@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data
    assert data['user']['email'] == 'login@example.com'


def test_get_items_requires_auth(client):
    """Test that getting items requires authentication."""
    response = client.get('/api/items')
    assert response.status_code == 401


def test_create_item_success(client, auth_token):
    """Test creating an item with authentication."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    
    response = client.post('/api/items', 
                          json={
                              'name': 'Test Item',
                              'description': 'A test item',
                              'price': 19.99
                          },
                          headers=headers)
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'Test Item'
    assert data['price'] == 19.99


def test_get_items_with_auth(client, auth_token):
    """Test getting items with authentication."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    
    # Create an item first
    client.post('/api/items', 
               json={'name': 'Get Test Item', 'price': 25.99},
               headers=headers)
    
    # Get all items
    response = client.get('/api/items', headers=headers)
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) >= 1
    assert data[0]['name'] == 'Get Test Item'


def test_update_item(client, auth_token):
    """Test updating an item."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    
    # Create an item
    create_response = client.post('/api/items', 
                                 json={'name': 'Update Item', 'price': 30.99},
                                 headers=headers)
    item_id = create_response.get_json()['id']
    
    # Update the item
    response = client.put(f'/api/items/{item_id}',
                         json={'name': 'Updated Item', 'price': 35.99},
                         headers=headers)
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['name'] == 'Updated Item'
    assert data['price'] == 35.99


def test_delete_item(client, auth_token):
    """Test deleting an item."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    
    # Create an item
    create_response = client.post('/api/items', 
                                 json={'name': 'Delete Item', 'price': 40.99},
                                 headers=headers)
    item_id = create_response.get_json()['id']
    
    # Delete the item
    response = client.delete(f'/api/items/{item_id}', headers=headers)
    
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = client.get(f'/api/items/{item_id}', headers=headers)
    assert get_response.status_code == 404


def test_invalid_login(client):
    """Test login with wrong credentials fails."""
    response = client.post('/api/auth/login', json={
        'email': 'wrong@example.com',
        'password': 'wrongpassword'
    })
    
    assert response.status_code == 401


def test_invalid_item_data(client, auth_token):
    """Test creating item with invalid data fails."""
    headers = {'Authorization': f'Bearer {auth_token}'}
    
    response = client.post('/api/items', 
                          json={'name': '', 'price': 'invalid'},
                          headers=headers)
    
    assert response.status_code == 400
    assert 'errors' in response.get_json()
