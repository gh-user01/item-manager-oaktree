import os
from app import create_app

# Create Flask application
config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
