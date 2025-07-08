from app.utils.database import get_db_connection


class Item:
    def __init__(self, id=None, name=None, description=None, price=None):
        self.id = id
        self.name = name
        self.description = description
        self.price = price

    @staticmethod
    def get_all():
        """Get all items"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM items ORDER BY id")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    @staticmethod
    def find_by_id(item_id):
        """Find item by ID"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
            row = cursor.fetchone()
            if row:
                return Item(
                    id=row['id'],
                    name=row['name'],
                    description=row['description'],
                    price=row['price']
                )
            return None

    def save(self):
        """Save item to database"""
        with get_db_connection() as conn:
            cursor = conn.cursor()
            if self.id is None:
                # Create new item
                cursor.execute(
                    "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
                    (self.name, self.description, self.price)
                )
                self.id = cursor.lastrowid
            else:
                # Update existing item
                cursor.execute(
                    "UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?",
                    (self.name, self.description, self.price, self.id)
                )
            conn.commit()
            return self

    def update(self, **kwargs):
        """Update item fields"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        return self.save()

    def delete(self):
        """Delete item from database"""
        if self.id:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM items WHERE id = ?", (self.id,))
                conn.commit()
                return True
        return False

    def to_dict(self):
        """Convert item to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price
        }
