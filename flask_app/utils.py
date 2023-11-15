import uuid
import secrets
from models import db, users, FollowSystem
import requests
from config import Config
from spotify_cred import *

def generate_public_id():
    return str(uuid.uuid4().hex)

def generate_random_state(length=32):
    return secrets.token_urlsafe(length)

def follower_finder(user):
    followers_query = db.session.query(FollowSystem.follower_username).filter_by(followed_username=user.username)
    followers = [follower[0] for follower in followers_query.all()]
    return followers

def followed_finder(user):
    followed_query = db.session.query(FollowSystem.followed_username).filter_by(follower_username=user.username)
    followed = [followed_user[0] for followed_user in followed_query.all()]
    return followed 

def username_to_user(username):
    user = users.query.filter_by(username=username).first()
    return user

def check_password(username, password):
    user = users.query.filter_by(username=username).first()
    if user.password == password:
        return True
    else:
        return False

def get_access_token(code):
    data = {
        'code': code,
        'redirect_uri': Config.SPOTIFY_REDIRECT_URI,
        'grant_type': 'authorization_code',
        'client_id': Config.SPOTIFY_CLIENT_ID,
        'client_secret': Config.SPOTIFY_CLIENT_SECRET,
    }
    response = requests.post(SPOTIFY_TOKEN_URL, data=data)   

    return response.json()

def get_user_infos(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(f"{SPOTIFY_API_BASE_URL}me", headers=headers)   

    return response.json()