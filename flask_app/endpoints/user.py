#Interfile imports 
from app import app, db
from utils import username_to_user, followed_finder, follower_finder
from models import users, FollowSystem

#Library imports
from flask import request, jsonify, send_file
from PIL import Image
from io import BytesIO

# Displaying general user info 
@app.route('/api/user_info', methods=['POST'])
def get_user_info():
    data = request.get_json()
    username = data.get('username')
    
    user = username_to_user(username)
    if not user:
        return jsonify({'error': 'Invalid username'}), 404
    
    followers = follower_finder(user)    
    followed = followed_finder(user)
    
    user_info = {'username': user.username,
                 'email': user.email,
                 'birthday': user.birthday,                 
                 'follower_count': len(followers),
                 'followed_count': len(followed)}
    
    return jsonify(user_info)

# Uploading a profile picture for the user for jpeg (optional: can be expanded to include other types as well)
@app.route('/api/upload_photo', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return jsonify({'error': 'Invalid request. Make sure to include a photo'}), 400

    if 'username' not in request.form:
        return jsonify({'error': 'Invalid request. Make sure to include a username'}), 400
    
    photo = request.files['photo']
    username = request.form['username']
        
    allowed_extensions = {'jpeg'}
    if '.' not in photo.filename or photo.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file format'}), 400
        
    photo_binary_data = photo.read()
        
    user = username_to_user(username)
    if user:
        user.profile_picture = photo_binary_data
        db.session.commit()
        return jsonify({'message': 'Photo uploaded and user profile picture updated successfully'})
    else:
        return jsonify({'error': 'User not found'}), 404

# Displaying the users profile picture
@app.route('/api/profile_picture', methods=['POST'])
def get_profile_picture():
    data = request.get_json()
    username = data.get('username')
    user = username_to_user(username)

    if user and user.profile_picture:
        image = Image.open(BytesIO(user.profile_picture))
        img_io = BytesIO()
        image.save(img_io, 'JPEG')  
        img_io.seek(0)

        return send_file(img_io, mimetype='image/jpeg')
    else:        
        return jsonify({'error': 'User or user.profile_picture not found'}), 404

# Deleting the user account
@app.route('/api/user_delete', methods=['POST']) 
def delete_user():
    data = request.get_json()
    username = data.get('username')
    
    user = username_to_user(username)
    if not user:
        return jsonify({'error': 'Invalid username'}), 404
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'User successfully deleted'}), 200

# Displaying the users followers along with the people that the user him/her-self follows
@app.route('/api/user_followings', methods=['POST'])
def user_followings():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400    
    
    user = username_to_user(username)
    followers = follower_finder(user)
    followed = followed_finder(user)
    return jsonify({f'Followers of {username}': followers, f'{username} follows': followed})

# Following someone with the follower/followed basis
@app.route('/api/follow', methods=['POST'])
def follow_user():
    data = request.get_json()
    follower_username = data.get('follower_username')
    followed_username = data.get('followed_username')
    
    follower = username_to_user(follower_username)
    followed = username_to_user(followed_username)

    if not follower or not followed:
        return jsonify({'error': 'Invalid usernames'}), 404
    
    existing_relationship = FollowSystem.query.filter_by(follower_username=follower.username, followed_username=followed.username).first()
    if existing_relationship:
        return jsonify({'error': 'Relationship already exists'}), 400
    
    new_relationship = FollowSystem(follower_username=follower.username, followed_username=followed.username)
    db.session.add(new_relationship)
    db.session.commit()

    return jsonify({'message': 'Relationship added successfully'}), 201

# Unfollow with the same follow basis
@app.route('/api/unfollow', methods=['POST'])
def unfollow_user():
    data = request.get_json()
    follower_username = data.get('follower_username')
    followed_username = data.get('followed_username')

    
    follower = username_to_user(follower_username)
    followed = username_to_user(followed_username)

    if not follower or not followed:
        return jsonify({'error': 'Invalid usernames'}), 404
    
    existing_relationship = FollowSystem.query.filter_by(follower_username=follower.username, followed_username=followed.username).first()
    if not existing_relationship:
        return jsonify({'error': 'Relationship does not exist'}), 404
    
    db.session.delete(existing_relationship)
    db.session.commit()

    return jsonify({'message': 'Relationship removed successfully'}), 200

# Getting all the follows in the database (only for search purposes i.e not to be shown on the frontend)
@app.route('/api/get_all_follows', methods=['GET'])
def get_all_follows():
    all_follows = FollowSystem.query.all()
    
    if not all_follows:
        all_follows = []
    
    follow_list = [
        {'follower_username': follow.follower_username,
         'followed_username': follow.followed_username}
        for follow in all_follows
    ]
    
    return jsonify(follow_list)

# Getting all the users in the database (only for search purposes i.e not to be shown on the frontend)
@app.route('/api/get_all_users', methods=['GET'])
def get_all_users():
    all_users = users.query.all()  
    
    if not all_users:
        all_users = []        
      
    users_list = [
        {'username': user.username,
         'password': user.password,
         'email': user.email,
         'birthday': user.birthday,         
         'public_id': user.public_id}
        for user in all_users
    ]    
    
    return jsonify(users_list)

