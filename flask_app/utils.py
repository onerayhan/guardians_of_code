import uuid
import secrets
from app import db
from config import Config
from models import *
from song_models import *
from spotify_cred import *
from spotipy.oauth2 import SpotifyOAuth
from datetime import datetime, timezone, timedelta

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

def song_id_to_song(song_id):
    song = Song.query.filter_by(song_id=song_id).first()
    return song

def song_id_to_song_name(song_id):
    song = Song.query.filter_by(song_id=song_id).first()
    if song:
        return song.song_name
    else:
        return None
    
def song_id_to_imported_song(song_id):
    imported_song = Imported_Song.query.filter_by(song_id=song_id).first()
    if imported_song:
        return imported_song.external_song_id
    else:
        return None

def album_id_to_album(album_id):
    album = Album.query.filter_by(album_id=album_id).first()
    return album

def performer_id_to_performer(performer_id):
    performer = Performer.query.filter_by(performer_id=performer_id).first()
    return performer

def album_name_to_album(album_name):
    album = Album.query.filter_by(name=album_name).first()
    return album

def performer_name_to_performer(performer_name):    
    
    performer = Performer.query.filter_by(name=performer_name).first()
    return performer
    
def song_name_to_album_name(song_name):
    
    if song_name_to_song(song_name):
        song_id = song_name_to_song(song_name).song_id
        
    else:
        return None
    
    song_album = Song_Album.query.filter_by(song_id=song_id).first()
    if song_album:
        album = Album.query.filter_by(album_id=song_album.album_id).first()
        return album.name
        
    return None

def song_name_to_performer_name(song_name):
    
    if song_name_to_song(song_name):
        song_id = song_name_to_song(song_name).song_id
        
    else:
        return None
    
    song_performer = Song_Performer.query.filter_by(song_id=song_id).first()
    if song_performer:
        performer = Performer.query.filter_by(performer_id=song_performer.performer_id).first()
        return performer.name
        
    return None


def song_name_to_genre_name(song_name):
    
    if song_name_to_song(song_name):
        song_id = song_name_to_song(song_name).song_id
    
    else:
        return None    
    
    song_genre = Song_Genre.query.filter_by(song_id=song_id).first()
    if song_genre:
        genre = Genre.query.filter_by(genre_id=song_genre.genre_id).first()
        return genre.name
        
    return None

def song_name_to_mood_name(song_name):
    
    if song_name_to_song(song_name):
        song_id = song_name_to_song(song_name).song_id
        
    else:
        return None
    
    song_mood = Song_Mood.query.filter_by(song_id=song_id).first()
    if song_mood:
        mood = Mood.query.filter_by(mood_id=song_mood.mood_id).first()
        return mood.name
        
    return None

def song_name_to_instrument_name(song_name):
    
    if song_name_to_song(song_name):
        song_id = song_name_to_song(song_name).song_id
        
    else:
        return None    
    
    song_instrument = Song_Instrument.query.filter_by(song_id=song_id).first()
    if song_instrument:
        instrument = Instrument.query.filter_by(instrument_id=song_instrument.instrument_id).first()
        return instrument.name
        
    return None

def get_user_songs(user):
    songs = Song.query.filter_by(username = user.username).all()
    if not songs:
        return []
        
    results = []
    
    for song in songs:        
        val = {'username': user.username,
               'songs_name': song.song_name,
               'song_id': song.song_id,
               'genre': song_name_to_genre_name(song.song_name),
               'album': song_name_to_album_name(song.song_name),
               'performer': song_name_to_performer_name(song.song_name),
               'mood': song_name_to_mood_name(song.song_name),
               'instrument': song_name_to_instrument_name(song.song_name)
               }
        results.append(val)
        
    return results
    

def check_password(username, password):
    user = username_to_user(username)
    if user.password == password:
        return True
    else:
        return False
    
def username_to_external_service(username):
    external_service = External_Service.query.filter_by(username=username).first()
    if external_service:
        return external_service
    else:
        return None

def create_spotify_oauth(state=None):    
    return SpotifyOAuth(
            client_id=Config.SPOTIFY_CLIENT_ID,
            client_secret=Config.SPOTIFY_CLIENT_SECRET,
            redirect_uri=Config.SPOTIFY_REDIRECT_URI,
            scope=[
                "user-top-read",
                "user-library-read",
                "user-follow-read",
                "playlist-read-private",
                "user-read-private"],
            state=state)
    
def get_token(username):
    
    token_valid = False    
    external_service = username_to_external_service(username)
    access_token = external_service.access_token   
    
    if not external_service:
        return None, token_valid
        
    is_token_expired = external_service.expires_at < datetime.now()    
    
    if (is_token_expired):
        sp_oauth = create_spotify_oauth()
        token_data = sp_oauth.refresh_access_token(external_service.refresh_token)
        external_service.access_token = token_data['access_token'] 
        external_service.refresh_token = token_data['refresh_token'] 
        
        expires_at_utc = datetime.utcfromtimestamp(token_data['expires_at']).replace(tzinfo=timezone.utc)                
        turkey_timezone = timezone(timedelta(hours=3))
        expires_at_turkey = expires_at_utc.astimezone(turkey_timezone)
           
        external_service.expires_at = expires_at_turkey
        access_token = external_service.access_token
        db.session.commit()
    
    token_valid = True
    return access_token, token_valid

def is_duplicate_imported(external_song_id):
    imported_song = Imported_Song.query.filter_by(external_song_id=external_song_id).first()
    if imported_song:
        return imported_song.external_song_id
    else:
        return False

def is_duplicate(song_data):
    existing_song = Song.query.filter_by(song_name=song_data.get('song_name')).first() 
    
    performer_name = song_data.get('performer_name')
    if performer_name:
        existing_song_performer = Performer.query.filter_by(name=performer_name).first()
      
    album_name = song_data.get('album_name') 
    if album_name:
        existing_song_album = Album.query.filter_by(name=album_name).first()      
    

    if existing_song and existing_song_album and existing_song_performer:
        return existing_song.song_id
    else:
        return False
             
    
def form_group(group_name, username_arr):    
    group = Group(group_name=group_name)
    db.session.add(group)
    db.session.commit()
    
    if username_arr:
        for username in username_arr:            
            group_user = GroupUser(username = username, group_id = group.group_id)
            db.session.add(group_user)
            db.session.commit()
            
def group_id_to_group(group_id):
    group = Group.query.filter_by(group_id=group_id).first()
    return group

def get_user_groups(username):
    groups = GroupUser.query.filter_by(username=username).all()
    results = []
    
    if not groups:
        return results
    
    for group in groups:
        results.append(group_id_to_group(group.group_id))
        
    return results

def get_group_members(group_id):
    members = GroupUser.query.filter_by(group_id=group_id).all()
    results = []
    
    if not members:
        return results
    
    for member in members:
        results.append(member.username)
        
    return results

def get_external_songs(username):
    imported_songs = Imported_Song.query.filter_by(username=username).all()
    results = []
    if imported_songs:
        for song in imported_songs:
            val = {'external_service_id': song.external_service_id}
            results.append(val)    
    
    return val        

def group_song_ratings(group_id):
    members = GroupUser.query.filter_by(group_id=group_id).all()
    results = []    
    
    for member in members:
        user_rated_songs = User_Song_Rating.query.filter_by(username=member.username).all()
        for rated_song in user_rated_songs:
            song_name = song_id_to_song(rated_song.song_id).song_name
            val = {'username': member.username,
                   'song_id': rated_song.song_id,
                   'genre': song_name_to_genre_name(song_name),
                   'artist': song_name_to_album_name(song_name),
                   'album': song_name_to_album_name(song_name),
                   'song': song_name,
                   'song_rating': rated_song.rating,
                   'rating_timestamp': rated_song.rating_timestamp,
                   'release_year': song_id_to_song(rated_song.song_id).release_year,
                   'external_service_id' : song_id_to_imported_song(rated_song.rating_id)}
            
            results.append(val)           
      
    return results  

def group_album_ratings(group_id):
    members = GroupUser.query.filter_by(group_id=group_id).all()
    results = []
    
    for member in members:
        user_rated_albums = User_Album_Rating.query.filter_by(username=member.username).all()
        for rated_album in user_rated_albums:
            album_name = album_id_to_album(rated_album.album_id).name
            val = {'username': member.username,                   
                   'album': album_name,                   
                   'album_rating': rated_album.rating,
                   'album_id': rated_album.album_id,
                   'rating_timestamp': rated_album.rating_timestamp}
            
            results.append(val)           
        
    return results 

def group_performer_ratings(group_id):
    members = GroupUser.query.filter_by(group_id=group_id).all()
    results = []
    
    for member in members:
        user_rated_performers = User_Performer_Rating.query.filter_by(username=member.username).all()
        for rated_performer in user_rated_performers:
            performer_name = performer_id_to_performer(rated_performer.performer_id).name
            val = {'username': member.username,                   
                   'performer': performer_name,                   
                   'performer_rating': rated_performer.rating,
                   'rating_timestamp': rated_performer.rating_timestamp}
            
            results.append(val)           
        
    return results  

def username_to_groups(username):    
    groups_user = GroupUser.query.filter_by(username=username).all()
    results = []
    
    if groups_user:
        for group in groups_user:               
            group = Group.query.filter_by(group_id=group.group_id).first()
            val = {'group_name': group.group_name, 'group_id': group.group_id, 'group_members': get_group_members(group.group_id)}
            results.append(val)
        
    return results         