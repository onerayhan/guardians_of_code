from flask import Flask, jsonify, request, redirect, session, send_file, render_template
from flask_cors import CORS
from urllib.parse import urlencode
from config import Config
from models import db, users, FollowSystem
from song_models import *
from utils import *
import base64
from datetime import datetime, timedelta
import jwt
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db.init_app(app)

@app.route('/logs', methods=['GET'])
def view_logs():
    with open('/var/log/gunicorn/log.txt', 'r') as log_file:
        logs = log_file.readlines()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':        
        return '\n'.join(logs)   
     
    return render_template('logs.html', logs=logs)

@app.route('/spoti_login')
def spoti_login():
    state = generate_random_state()
    session['state'] = state

    params = {
        'client_id': app.config['SPOTIFY_CLIENT_ID'],
        'response_type': 'code',
        'redirect_uri': app.config['SPOTIFY_REDIRECT_URI'],
        'scope': 'user-read-email user-read-private',
        'state': state,
    }

    spotify_auth_url = f"{SPOTIFY_AUTH_URL}?{urlencode(params)}"
    return redirect(spotify_auth_url)

@app.route('/callback')
def callback():
    try:
        code = request.args.get('code')
        state = request.args.get('state')

        if state is None:
            return redirect('/#' + urlencode({'error': 'state_mismatch'}))

        auth_options = {
            'url': 'https://accounts.spotify.com/api/token',
            'data': {
                'code': code,
                'redirect_uri': app.config['SPOTIFY_REDIRECT_URI'],
                'grant_type': 'authorization_code',
            },
            'headers': {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + base64.b64encode(f"{app.config['SPOTIFY_CLIENT_ID']}:{app.config['SPOTIFY_CLIENT_SECRET']}".encode()).decode(),
            },
            'json': True,
        }

        response = requests.post(auth_options['url'], data=auth_options['data'], headers=auth_options['headers'])

        if response.status_code == 200:
            token_data = response.json()
            session['access_token'] = token_data['access_token']                       
            user_info = get_user_infos(session['access_token'])
            return jsonify(user_info)

        return "Token Request Failed", 500

    except Exception as e:
        app.logger.error(f"Error in callback: {e}")
        return "Fail in callback // Hamzaya sor", 500
    
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
        return jsonify({'error': 'Such username already exists'}), 409  
    
    if users.query.filter_by(email=email).first():
        return jsonify({'error': 'Such email already exists'}), 409          

    public_id = generate_public_id()
    db.session.add(users(username=username, email=email, password=password, birthday=birthday, public_id=public_id))
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'public_id': public_id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  
    #device_token = data.get('device_token')
    
    if not username or not password:
        return jsonify({'error' : "Both email and password are required"}), 400
    
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

@app.route('/api/upload_photo', methods=['POST'])
def upload_photo():
    if 'photo' not in request.files:
        return jsonify({'error': 'Invalid request. Make sure to include a photo'}), 400

    if 'username' not in request.form:
        return jsonify({'error': 'Invalid request. Make sure to include a username'}), 400
    
    photo = request.files['photo']
    username = request.form['username']
        
    allowed_extensions = {'png', 'jpg', 'jpeg'}
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
                 'profile_picture': user.profile_picture,
                 'follower_count': len(followers),
                 'followed_count': len(followed)}
    
    return jsonify(user_info)

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

@app.route('/api/user_followings', methods=['POST'])
def user_followings():
    data = request.get_json()
    username = data.get('username')
    
    user = username_to_user(username)
    followers = follower_finder(user)
    followed = followed_finder(user)
    return jsonify({f'Followers of {username}': followers, f'{username} follows': followed})    
    
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
        

@app.route('/api/get_all_follows', methods=['GET'])
def get_all_follows():
    all_follows = FollowSystem.query.all()
    follow_list = [
        {'follower_username': follow.follower_username,
         'followed_username': follow.followed_username}
        for follow in all_follows
    ]
    
    return jsonify(follow_list)
   
@app.route('/api/get_all_users', methods=['GET'])
def get_all_users():
    all_users = users.query.all()    
    users_list = [
        {'username': user.username,
         'password': user.password,
         'email': user.email,
         'birthday': user.birthday,
         'profile_picture': user.profile_picture,
         'public_id': user.public_id}
        for user in all_users
    ]
    
    return jsonify(users_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
