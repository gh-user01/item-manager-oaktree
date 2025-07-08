import sqlite3
from contextlib import contextmanager
from flask import current_app
from werkzeug.security import generate_password_hash


def init_db():
    """Initialize the SQLite database with items and users tables"""
    conn = sqlite3.connect(current_app.config['DATABASE_PATH'])
    cursor = conn.cursor()
    
    # Create items table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL
        )
    """)
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    
    # Add demo user and sample data if database is empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        # Add demo user
        demo_password_hash = generate_password_hash('demo123')
        cursor.execute("""
            INSERT INTO users (email, password_hash, name)
            VALUES (?, ?, ?)
        """, ('demo@example.com', demo_password_hash, 'Demo User'))
        
        # Add sample items
        cursor.execute("""
            INSERT INTO items (name, description, price)
            VALUES 
            ('Sample Laptop', 'A high-performance laptop for work and gaming', 999.99),
            ('Wireless Headphones', 'Premium noise-cancelling headphones', 299.99),
            ('Smart Watch', 'Fitness tracking and notifications', 199.99),
            ('Coffee Maker', 'Automatic drip coffee maker', 89.99),
            ('Desk Chair', 'Ergonomic office chair', 249.99)
        """)
        
        conn.commit()
    
    conn.close()


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(current_app.config['DATABASE_PATH'])
    conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
    try:
        yield conn
    finally:
        conn.close()
