from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from contextlib import contextmanager

app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app, origins=["http://localhost:3000"])

# Database setup
DATABASE_PATH = "items.db"

def init_db():
    """Initialize the SQLite database with items table"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL
        )
    """)
    conn.commit()
    conn.close()

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
    try:
        yield conn
    finally:
        conn.close()

# Validation functions
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

# Initialize database when the app starts
with app.app_context():
    init_db()

# API Endpoints

@app.route("/api/items", methods=["GET"])
def get_items():
    """Get all items"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM items ORDER BY id")
            items = cursor.fetchall()
            return jsonify([dict(item) for item in items])
    except Exception as e:
        return jsonify({"error": "Failed to fetch items"}), 500

@app.route("/api/items", methods=["POST"])
def create_item():
    """Create a new item"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "JSON data is required"}), 400
        
        # Validate data
        errors = validate_item_data(data)
        if errors:
            return jsonify({"errors": errors}), 400
        
        # Clean and prepare data
        name = data['name'].strip()
        description = data.get('description', '').strip()
        price = float(data['price'])
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
                (name, description, price)
            )
            conn.commit()
            item_id = cursor.lastrowid
            
            # Fetch the created item
            cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
            created_item = cursor.fetchone()
            return jsonify(dict(created_item)), 201
            
    except Exception as e:
        return jsonify({"error": "Failed to create item"}), 500

@app.route("/api/items/<int:item_id>", methods=["GET"])
def get_item(item_id):
    """Get a specific item by ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
            item = cursor.fetchone()
            
            if not item:
                return jsonify({"error": f"Item with id {item_id} not found"}), 404
            
            return jsonify(dict(item))
            
    except Exception as e:
        return jsonify({"error": "Failed to fetch item"}), 500

@app.route("/api/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    """Update an existing item by ID"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "JSON data is required"}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if item exists
            cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
            existing_item = cursor.fetchone()
            
            if not existing_item:
                return jsonify({"error": f"Item with id {item_id} not found"}), 404
            
            # Validate data for update
            errors = validate_item_data(data, is_update=True)
            if errors:
                return jsonify({"errors": errors}), 400
            
            # Build update query dynamically based on provided fields
            update_fields = []
            update_values = []
            
            if 'name' in data:
                update_fields.append("name = ?")
                update_values.append(data['name'].strip())
            
            if 'description' in data:
                update_fields.append("description = ?")
                update_values.append(data['description'].strip())
            
            if 'price' in data:
                update_fields.append("price = ?")
                update_values.append(float(data['price']))
            
            if not update_fields:
                # No fields to update, return existing item
                return jsonify(dict(existing_item))
            
            update_values.append(item_id)
            update_query = f"UPDATE items SET {', '.join(update_fields)} WHERE id = ?"
            
            cursor.execute(update_query, update_values)
            conn.commit()
            
            # Fetch updated item
            cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
            updated_item = cursor.fetchone()
            return jsonify(dict(updated_item))
            
    except Exception as e:
        return jsonify({"error": "Failed to update item"}), 500

@app.route("/api/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    """Delete an item by ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if item exists
            cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
            existing_item = cursor.fetchone()
            
            if not existing_item:
                return jsonify({"error": f"Item with id {item_id} not found"}), 404
            
            cursor.execute("DELETE FROM items WHERE id = ?", (item_id,))
            conn.commit()
            
            return '', 204
            
    except Exception as e:
        return jsonify({"error": "Failed to delete item"}), 500

@app.route("/")
def root():
    """Health check endpoint"""
    return jsonify({"message": "Item Manager API is running!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
