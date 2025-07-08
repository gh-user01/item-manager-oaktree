#!/usr/bin/env python3
"""
Script to populate the database with sample items for testing
"""

import sqlite3

DATABASE_PATH = "items.db"

def seed_database():
    """Add sample items to the database"""
    
    sample_items = [
        {
            "name": "Laptop",
            "description": "High-performance laptop for work and gaming",
            "price": 1299.99
        },
        {
            "name": "Coffee Mug",
            "description": "Ceramic coffee mug with funny programming quotes",
            "price": 15.99
        },
        {
            "name": "Wireless Mouse",
            "description": "Ergonomic wireless mouse with USB receiver",
            "price": 29.99
        },
        {
            "name": "Notebook",
            "description": "Spiral-bound notebook for taking notes",
            "price": 7.50
        },
        {
            "name": "USB Cable",
            "description": "USB-C to USB-A cable, 6 feet long",
            "price": 12.99
        }
    ]
    
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Clear existing data
    cursor.execute("DELETE FROM items")
    
    # Insert sample data
    for item in sample_items:
        cursor.execute(
            "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
            (item["name"], item["description"], item["price"])
        )
    
    conn.commit()
    conn.close()
    
    print(f"Successfully seeded database with {len(sample_items)} items!")

if __name__ == "__main__":
    seed_database()
