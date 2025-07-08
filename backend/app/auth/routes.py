from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from app.models.user import User
from app.utils.validators import validate_user_data

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Blacklist for logout functionality
blacklisted_tokens = set()


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate input data
        errors = validate_user_data(data, is_login=False)
        if errors:
            return jsonify({"errors": errors}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        name = data['name'].strip()
        
        # Check if user already exists
        if User.email_exists(email):
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Create new user
        user = User(email=email, name=name)
        user.set_password(password)
        user.save()
        
        # Create tokens
        user_id_str = str(user.id)
        additional_claims = {"user_id": user.id}
        access_token = create_access_token(
            identity=user_id_str,
            additional_claims=additional_claims
        )
        refresh_token = create_refresh_token(identity=user_id_str)
        
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate input data
        errors = validate_user_data(data, is_login=True)
        if errors:
            return jsonify({"errors": errors}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Find user and check password
        user = User.find_by_email(email)
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Create tokens
        user_id_str = str(user.id)
        additional_claims = {"user_id": user.id}
        access_token = create_access_token(
            identity=user_id_str,
            additional_claims=additional_claims
        )
        refresh_token = create_refresh_token(identity=user_id_str)
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            "access_token": access_token
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    """Logout user by blacklisting the token"""
    try:
        jti = get_jwt()['jti']
        blacklisted_tokens.add(jti)
        
        return jsonify({"message": "Successfully logged out"}), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    try:
        user_id = get_jwt_identity()
        actual_user_id = int(user_id)
        
        user = User.find_by_id(actual_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


def is_token_revoked(jwt_header, jwt_payload):
    """Check if a JWT exists in the blacklist"""
    return jwt_payload['jti'] in blacklisted_tokens
