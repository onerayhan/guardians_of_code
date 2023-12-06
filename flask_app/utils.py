import uuid
import secrets
from models import db, users, FollowSystem
from song_models import *
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

def song_name_to_song(song_name):
    song = Song.query.filter_by(song_name=song_name).first()
    return song

def album_name_to_album(album_name):
    album = Album.query.filter_by(name=album_name).first()
    return album

def performer_name_to_performer(performer_name):
    performer = Performer.query.filter_by(name=performer_name).first()
    return performer
    
def song_name_to_album_name(song_name):
    song_id = song_name_to_song(song_name).song_id
    song_album = Song_Album.query.filter_by(song_id=song_id).first()
    if song_album:
        album = Album.query.filter_by(album_id=song_album.album_id).first()
        return album.name
        
    return None

def song_name_to_performer_name(song_name):
    song_id = song_name_to_song(song_name).song_id
    song_performer = Song_Performer.query.filter_by(song_id=song_id).first()
    if song_performer:
        performer = Performer.query.filter_by(performer_id=song_performer.performer_id).first()
        return performer.name
        
    return None

def song_name_to_genre_name(song_name):
    song_id = song_name_to_song(song_name).song_id
    song_genre = Song_Genre.query.filter_by(song_id=song_id).first()
    if song_genre:
        genre = Genre.query.filter_by(genre_id=song_genre.genre_id).first()
        return genre.name
        
    return None

def song_name_to_mood_name(song_name):
    song_id = song_name_to_song(song_name).song_id
    song_mood = Song_Mood.query.filter_by(song_id=song_id).first()
    if song_mood:
        mood = Mood.query.filter_by(mood_id=song_mood.mood_id).first()
        return mood.name
        
    return None

def song_name_to_instrument_name(song_name):
    song_id = song_name_to_song(song_name).song_id
    song_instrument = Song_Instrument.query.filter_by(song_id=song_id).first()
    if song_instrument:
        instrument = Instrument.query.filter_by(instrument_id=song_instrument.instrument_id).first()
        return instrument.name
        
    return None

def check_password(username, password):
    user = username_to_user(username)
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

def is_duplicate(song_data):
    existing_song = Song.query.filter_by(
        song_name=song_data.get('song_name'),
        length=song_data.get('length'),
        listens=song_data.get('listens'),
        tempo=song_data.get('tempo')
    ).first()

    if existing_song:
        return True
    else:
        return False       