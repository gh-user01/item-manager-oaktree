#!/usr/bin/env python3
"""
Seed the database with sample users and items for testing authentication
"""

import sqlite3
from werkzeug.security import generate_password_hash

DATABASE_PATH = "items.db"


def seed_auth_data():
    """Add sample users and items to the database"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()

    try:
        # Create test users
        test_users = [
            {
                'email': 'john@example.com',
                'password': 'password123',
                'name': 'John Doe'
            },
            {
                'email': 'jane@example.com',
                'password': 'password123',
                'name': 'Jane Smith'
            }
        ]

        # Insert users
        for user in test_users:
            password_hash = generate_password_hash(user['password'])

            # Check if user already exists
            cursor.execute(
                "SELECT id FROM users WHERE email = ?", (user['email'],))
            existing_user = cursor.fetchone()

            if existing_user:
                print(f"User {user['email']} already exists, skipping...")
                continue

            cursor.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
                (user['email'], password_hash, user['name'])
            )
            user_id = cursor.lastrowid
            print(f"Created user: {user['email']} (ID: {user_id})")

        # Clear existing items to avoid conflicts
        cursor.execute("DELETE FROM items")

        # Create sample items
        sample_items = [
            {
                'name': 'Wireless Headphones',
                'description': 'High-quality Bluetooth headphones with noise cancellation',
                'price': 149.99
            },
            {
                'name': 'Coffee Mug',
                'description': 'Ceramic coffee mug with custom design',
                'price': 12.99
            },
            {
                'name': 'Laptop Stand',
                'description': 'Adjustable aluminum laptop stand for better ergonomics',
                'price': 45.00
            },
            {
                'name': 'Yoga Mat',
                'description': 'Premium eco-friendly yoga mat with excellent grip',
                'price': 35.99
            },
            {
                'name': 'Plant Pot',
                'description': 'Beautiful ceramic plant pot for indoor plants',
                'price': 18.50
            },
            {
                'name': 'LED Desk Lamp',
                'description': 'Modern LED desk lamp with adjustable brightness',
                'price': 29.99
            }
        ]

        # Insert items
        for item in sample_items:
            cursor.execute(
                "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
                (item['name'], item['description'], item['price'])
            )

        print(f"Created {len(sample_items)} sample items")

        conn.commit()
        print("\n✅ Database seeded successfully!")
        print("\nTest accounts:")
        print("👤 Email: john@example.com | Password: password123")
        print("👤 Email: jane@example.com | Password: password123")
        print("\nYou can now test authentication with these accounts!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    seed_auth_data()
