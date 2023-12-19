#Interfile imports 
from app import app, db
from utils import generate_public_id, username_to_user, check_password
from models import users

#Library imports
from flask import session, request, jsonify
from datetime import datetime, timedelta
import jwt

# Registering the user, checking for email and username correspondance for possible duplicate account creation
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')    
    password = data.get('password')
    email = data.get('email')
    birthday = data.get('birthday')     
    
    if not email or not password or not birthday or not username:
        return jsonify({'error': 'Email/Password/Birthday/Username are required'}), 400
    
    if users.query.filter_by(username=username).first():
        return jsonify({'error': 'Such username already exists'}), 403  
    
    if users.query.filter_by(email=email).first():
        return jsonify({'error': 'Such email already exists'}), 403
    
    session['username'] = username          

    public_id = generate_public_id()
    db.session.add(users(username=username, email=email, password=password, birthday=birthday, public_id=public_id))
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'public_id': public_id}), 201

# Signing in the user
# Forming a jwt token for web app to process and hold user public id along with their logging in timestamp
# Possible to add device token for auto login purposes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  
    #device_token = data.get('device_token') 
    
    
    if not username or not password:
        return jsonify({'error' : "Both username and password are required"}), 400
    
    session['username'] = username   
    
    user = username_to_user(username)
    
    if user and user.password == password:        
        token = jwt.encode({
            'public_id': user.public_id,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        #existing_device_token = DeviceToken.query.filter_by(device_token=device_token).first()
        
        #if not existing_device_token:
        #    db.session.add(DeviceToken(device_token=device_token, public_id=user.public_id))
        #    db.session.commit()

        return jsonify({'message': 'User login successful', 'token': token}), 200
    else:
        return jsonify({'error': 'Invalid username or password '}), 401
    
#@app.route('/api/auto_login', methods=['POST'])
#def auto_login():
#    data = request.get_json()
#    device_token = data.get('device_token')
#     
#    existing_token = DeviceToken.query.filter_by(device_token=device_token).first()
#    token_pid = existing_token.public_id
#    user = users.query.filter_by(token_pid=public_id).first()
#    public_id = user.public_id
#
#    if user:
#        return jsonify({'public_id': user.public_id}), 200
#    else:
#        return jsonify({'error': 'User not found'}), 404
    
# Loggin the user and out popping the session keys to avoid any possible session token interdiction    
@app.route('/api/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
        
    return jsonify({'message': "Successful logout."})

# Changing the password (optional: add additional checks for including special characters and uppercase letters)
@app.route('/api/change_password', methods=['POST'])
def change_password():
    data = request.get_json()
    username = data.get('username')
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not username or not old_password or not new_password:
        return jsonify({'error': 'Username/old password/new password are required'}), 400

    user = username_to_user(username)

    if not user or not check_password(username, old_password):
        return jsonify({'error': 'Invalid username or old password'}), 401
    
    user.password = new_password
    db.session.commit()

    return jsonify({'message': 'Password changed successfully'}), 200