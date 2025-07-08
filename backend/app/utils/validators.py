def validate_item_data(data, is_update=False):
    """Validate item data and return errors if any"""
    errors = []
    
    # Validate name
    if 'name' in data:
        if not data['name'] or not data['name'].strip():
            errors.append("Name cannot be empty")
    elif not is_update:
        errors.append("Name is required")
    
    # Validate price
    if 'price' in data:
        try:
            price = float(data['price'])
            if price <= 0:
                errors.append("Price must be a positive number")
        except (ValueError, TypeError):
            errors.append("Price must be a valid number")
    elif not is_update:
        errors.append("Price is required")
    
    return errors


def validate_user_data(data, is_login=False):
    """Validate user registration/login data and return errors if any"""
    errors = []
    
    # Validate email
    if 'email' not in data or not data['email']:
        errors.append("Email is required")
    elif '@' not in data['email'] or '.' not in data['email']:
        errors.append("Invalid email format")
    
    # Validate password
    if 'password' not in data or not data['password']:
        errors.append("Password is required")
    elif not is_login and len(data['password']) < 6:
        errors.append("Password must be at least 6 characters long")
    
    # Validate name
    if not is_login:
        if 'name' not in data or not data['name'] or not data['name'].strip():
            errors.append("Name is required")
    
    return errors
