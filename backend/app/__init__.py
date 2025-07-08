from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import config
from app.utils.database import init_db


def create_app(config_name='default'):
    """Flask application factory"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, origins=app.config['CORS_ORIGINS'])
    jwt = JWTManager(app)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"msg": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"msg": "Invalid token"}), 422

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({"msg": "Missing Authorization Header"}), 401

    # Register token blacklist checker
    from app.auth.routes import is_token_revoked
    
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return is_token_revoked(jwt_header, jwt_payload)
    
    # Register blueprints
    from app.auth.routes import auth_bp
    from app.api.routes import api_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)
    
    # Health check endpoint
    @app.route("/")
    def root():
        """Health check endpoint"""
        return jsonify({"message": "Item Manager API is running!"})
    
    # Initialize database (only if not in testing mode)
    if not app.config.get('TESTING', False):
        with app.app_context():
            init_db()
    
    return app
