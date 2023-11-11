from flask import Flask, jsonify, request
from  werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from functools import wraps
import uuid
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:admin@127.0.0.1/cs308_backend_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    birthday = db.Column(db.String(100), nullable=False)
    profile_picture = db.Column(db.LargeBinary, nullable=True)
    public_id = db.Column(db.String(32), primary_key=True, nullable=False)
    
class FollowSystem(db.Model):
    follower_username = db.Column(db.String(100), nullable=False, primary_key=True)
    followed_username = db.Column(db.String(100), nullable=False, primary_key=True)
    __table_args__ = (
        db.ForeignKeyConstraint(['follower_username'], ['users.username']),
        db.ForeignKeyConstraint(['followed_username'], ['users.username'])
    )

#burada problem var
app.config['SECRET_KEY'] = '5p#r7GZ9!J^T8&d@E*2$yS'

def generate_public_id():
    return str(uuid.uuid4().hex)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')    
    password = data.get('password')
    email = data.get('email')
    birthday = data.get('birthday')    
    if not email or not password or not birthday or not username:
        return jsonify({'message': 'Email/Password/Birthday/Username are required'}), 400
    
    if Users.query.filter_by(username=username).first():
        return jsonify({'message': 'Such username already exists'}), 409  
    
    if Users.query.filter_by(email=email).first():
        return jsonify({'message': 'Such email already exists'}), 409          

    public_id = generate_public_id()
    db.session.add(Users(username=username, email=email, password=password, birthday=birthday, public_id=public_id))
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'public_id': public_id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')  
    
    if not username or not password:
        return jsonify({'message' : "Both email and password are required"}), 400
    
    user = Users.query.filter_by(username=username).first()
    
    if user and user.password == password:        
        token = jwt.encode({
            'public_id': user.public_id,
            'exp': datetime.utcnow() + timedelta(minutes=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'message': 'User login successful', 'token': token}), 200
    else:
        return jsonify({'message': 'Invalid username or password '}), 401
    
@app.route('/api/user_info', methods=['POST'])
def get_user_follower_following():
    data = request.get_json()
    username = data.get('username')
    
    user = Users.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'Invalid username'}), 404
    
    followers_query = db.session.query(FollowSystem.follower_username).filter_by(followed_username=user.username)
    followers = [follower[0] for follower in followers_query.all()]


    followed_query = db.session.query(FollowSystem.followed_username).filter_by(follower_username=user.username)
    followed = [followed_user[0] for followed_user in followed_query.all()]
    
    return jsonify({f'followers for {username}': followers, f'followed for {username}': followed})   
    
@app.route('/api/follow', methods=['POST'])
def follow_user():
    data = request.get_json()
    follower_username = data.get('follower_username')
    followed_username = data.get('followed_username')
    
    follower = Users.query.filter_by(username=follower_username).first()
    followed = Users.query.filter_by(username=followed_username).first()

    if not follower or not followed:
        return jsonify({'message': 'Invalid usernames'}), 404
    
    existing_relationship = FollowSystem.query.filter_by(follower_username=follower.username, followed_username=followed.username).first()
    if existing_relationship:
        return jsonify({'message': 'Relationship already exists'}), 400
    
    new_relationship = FollowSystem(follower_username=follower.username, followed_username=followed.username)
    db.session.add(new_relationship)
    db.session.commit()

    return jsonify({'message': 'Relationship added successfully'}), 201

@app.route('/api/unfollow', methods=['POST'])
def unfollow_user():
    data = request.get_json()
    follower_username = data.get('follower_username')
    followed_username = data.get('followed_username')

    
    follower = Users.query.filter_by(username=follower_username).first()
    followed = Users.query.filter_by(username=followed_username).first()

    if not follower or not followed:
        return jsonify({'message': 'Invalid usernames'}), 404
    
    existing_relationship = FollowSystem.query.filter_by(follower_username=follower.username, followed_username=followed.username).first()
    if not existing_relationship:
        return jsonify({'message': 'Relationship does not exist'}), 404
    
    db.session.delete(existing_relationship)
    db.session.commit()

    return jsonify({'message': 'Relationship removed successfully'}), 200
   
@app.route('/api/get_all_users', methods=['GET'])
def get_all_users():
    all_users = Users.query.all()    
    users_list = [
        {'username': user.username, 'password': user.password, 'email': user.email, 'birthday': user.birthday, 'profile_picture': user.profile_picture, 'public_id': user.public_id}
        for user in all_users
    ]
    
    return jsonify(users_list)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
