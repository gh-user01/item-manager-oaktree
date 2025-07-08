from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models.item import Item
from app.utils.validators import validate_item_data

api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route("/items", methods=["GET"])
@jwt_required()
def get_items():
    """Get all items (authentication required)"""
    try:
        items = Item.get_all()
        return jsonify(items)
    except Exception as e:
        return jsonify({"error": "Failed to fetch items"}), 500


@api_bp.route("/items", methods=["POST"])
@jwt_required()
def create_item():
    """Create a new item (authentication required)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "JSON data is required"}), 400
        
        # Validate data
        errors = validate_item_data(data)
        if errors:
            return jsonify({"errors": errors}), 400
        
        # Create new item
        item = Item(
            name=data['name'].strip(),
            description=data.get('description', '').strip(),
            price=float(data['price'])
        )
        item.save()
        
        return jsonify(item.to_dict()), 201
        
    except Exception as e:
        return jsonify({"error": "Failed to create item"}), 500


@api_bp.route("/items/<int:item_id>", methods=["GET"])
@jwt_required()
def get_item(item_id):
    """Get a specific item by ID (authentication required)"""
    try:
        item = Item.find_by_id(item_id)
        
        if not item:
            return jsonify({"error": f"Item with id {item_id} not found"}), 404
        
        return jsonify(item.to_dict())
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch item"}), 500


@api_bp.route("/items/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_item(item_id):
    """Update an existing item by ID (authentication required)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "JSON data is required"}), 400
        
        item = Item.find_by_id(item_id)
        if not item:
            return jsonify({"error": f"Item with id {item_id} not found"}), 404
        
        # Validate data for update
        errors = validate_item_data(data, is_update=True)
        if errors:
            return jsonify({"errors": errors}), 400
        
        # Update fields
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name'].strip()
        if 'description' in data:
            update_data['description'] = data['description'].strip()
        if 'price' in data:
            update_data['price'] = float(data['price'])
        
        if not update_data:
            # No fields to update, return existing item
            return jsonify(item.to_dict())
        
        item.update(**update_data)
        return jsonify(item.to_dict())
        
    except Exception as e:
        return jsonify({"error": "Failed to update item"}), 500


@api_bp.route("/items/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_id):
    """Delete an item by ID (authentication required)"""
    try:
        item = Item.find_by_id(item_id)
        
        if not item:
            return jsonify({"error": f"Item with id {item_id} not found"}), 404
        
        item.delete()
        return '', 204
        
    except Exception as e:
        return jsonify({"error": "Failed to delete item"}), 500
