from flask import Flask, jsonify, request
from  werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from functools import wraps
import uuid

app = Flask(__name__)
CORS(app)

users = []

app.config['SECRET_KEY'] = '5p#r7GZ9!J^T8&d@E*2$yS'

def generate_public_id():
    return str(uuid.uuid4().hex)

@app.route('/api/register', methods=['POST'])

def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Both username and password are required'}), 400

    public_id = generate_public_id()
    users.append({'username': username, 'password': password, 'public_id' : public_id})
    return jsonify({'message': 'User registered successfully', 'public_id': public_id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  
      
    if not username or not password:
        return jsonify({'message' : "Both username and password are required"}), 400
    
    user_checker = False
    public_id_login = 0
    for user in users:
        if user['username'] == username and user['password'] == password:
            user_checker = True
            public_id_login = user['public_id']

    if user_checker == False:
        return jsonify({'message': 'Invalid username or password'}), 401

    token = jwt.encode({
        'public_id': public_id_login,
        'exp': datetime.utcnow() + timedelta(minutes=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')    
    
    return jsonify({'token': token}, {'message' : 'User login succesfull'}), 200    
    
@app.route('/api/get_all_users', methods=['GET'])
def get_all_users():
    return jsonify(users)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)