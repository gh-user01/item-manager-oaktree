from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.database import get_db_connection


class User:
    def __init__(self, id=None, email=None, name=None, password_hash=None):
        self.id = id
        self.email = email
        self.name = name
        self.password_hash = password_hash

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, email, password_hash, name FROM users WHERE email = ?", (email,))
            row = cursor.fetchone()
            if row:
                return User(
                    id=row['id'],
                    email=row['email'],
                    name=row['name'],
                    password_hash=row['password_hash']
                )
            return None

    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, email, name FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                return User(
                    id=row['id'],
                    email=row['email'],
                    name=row['name']
                )
            return None

    @staticmethod
    def email_exists(email):
        """Check if email already exists"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            return cursor.fetchone() is not None

    def save(self):
        """Save user to database"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
                (self.email, self.password_hash, self.name)
            )
            self.id = cursor.lastrowid
            conn.commit()
            return self

    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Check password against hash"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name
        }
