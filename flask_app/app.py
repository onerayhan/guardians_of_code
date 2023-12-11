from flask import Flask, jsonify, request, redirect, session, send_file, render_template
from flask_cors import CORS
from urllib.parse import urlencode
from config import Config
import base64
import requests
from datetime import datetime, timedelta
import jwt
from PIL import Image
from io import BytesIO
import spotipy
import json
from flask_sqlalchemy import SQLAlchemy
import time

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy()
db.init_app(app)


time.sleep(1)

from models import *
from song_models import *
from utils import *

#Config.py hidden due to security reasons (same with ip4 address for ec2 instance)

@app.route('/logs', methods=['GET'])
def view_logs():
    with open('/var/log/gunicorn/log.txt', 'r') as log_file:
        logs = log_file.readlines()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return '\n'.join(logs)

    return render_template('logs.html', logs=logs)

@app.route('/spoti_login/<username>')
def spoti_login(username):   
    state = generate_random_state()
    session['state'] = state
    session['username'] = username

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
        username = session['username']
                             
        if response.status_code == 200:
            
            token_data = json.dumps(response.json())       
                                    
            external_service = External_Service.query.filter_by(username=username).first()
            if external_service:
                external_service.access_token = session['access_token']
            
            else:
                db.session.add(External_Service(username=username,
                                                service_name='Spotify',                                                
                                                token_data=token_data))
                db.session.commit()      
            
            return jsonify({'message': f'{username} spotify connection established.'})           

        else:
            "Token Request Failed", 500

    except Exception as e:
        app.logger.error(f"Error in callback: {e}")
        return "Fail in callback // Hamzaya sor", 500    


@app.route('/spoti/get_curr_user_tracks/<username>')
def get_curr_user_tracks():     
    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    curGroup = sp.current_user_saved_tracks(limit=10)['items']
    for item in curGroup:
        track = item['track']
        val = {"track_name": track['name'],
               "album_name": track['album']['name'],
               "artist_names": [{'artist_name': artist['name']} for artist in track['artists']],
               "popularity": track['popularity'],
               "track_id": track['id'],
               "album_release_year": track['album']['release_date'].split('-')[0],               
               "track_duration_minutes": round(float(track['duration_ms']/1000/60), 2),
               "track_photo_urls": [{'photo_url': image['url']} for image in track['images']],
               "album_id": track['album']['id'],
               "artist_ids": [{'artist_id': artist['id']} for artist in track['artists']]}             
            
        results.append(val)              
    
    return jsonify(results)

@app.route('/spoti/get_user_top_tracks/<username>')
def get__user_top_tracks(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    track_list = sp.current_user_top_tracks(limit=10)['items']
    for item in track_list:
        track = item['track']
        val = {"track_name": track['name'],
               "album_name": track['album']['name'],
               "artist_names": [{'artist_name': artist['name']} for artist in track['artists']],
               "popularity": track['popularity'],
               "track_id": track['id'],
               "track_release_year": track['album']['release_date'].split('-')[0],               
               "track_duration_minutes": round(float(track['duration_ms']/1000/60), 2),
               "track_photo_urls": [{'photo_url': image['url']} for image in track['images']],
               "album_id": track['album']['id'],
               "artist_ids": [{'artist_id': artist['id']} for artist in track['artists']]}           
            
        results.append(val)              
    
    return jsonify(results)

@app.route('/spoti/get_tracks_info/<username>/<track_id_arr>')
def get_tracks_info(username, track_id_arr):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    tracks = sp.tracks(track_id_arr)['tracks']
    for track in tracks:
        val = {"track_name": track['name'],
               "album_name": track['album']['name'],
               "artist_names": [{'artist_name': artist['name']} for artist in track['artists']],
               "popularity": track['popularity'],
               "track_id": track['id'],
               "track_release_year": track['album']['release_date'].split('-')[0],               
               "track_duration_minutes": round(float(track['duration_ms']/1000/60), 2),
               "track_photo_urls": [{'photo_url': image['url']} for image in track['images']],
               "album_id": track['album']['id'],
               "artist_ids": [{'artist_id': artist['id']} for artist in track['artists']]} 
        
        results.append(val)
        
    return jsonify(results)

@app.route('/spoti/get_albums_info/<username>/<album_id_arr>')
def get_albums_info(username, album_id_arr):
    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    albums = sp.albums(album_id_arr)['albums']
    for album in albums:
        val = {"album_name": album['name'],
               "album_release_year": album['release_date'].split('-')[0],
               "album_photo_url": [{'photo_url': image['url']} for image in album['images']],
               "popularity": album['popularity'],
               "album_id": album['id']} 
        
        results.append(val)
        
    return jsonify(results)

@app.route('/spoti/get_artists_info/<username>/<artist_id_arr>')
def get_artists_info(username, artist_id_arr):
    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    artists = sp.artists(artist_id_arr)['artists']
    for artist in artists:
        val = {"artist_name": artist['name'],
               "popularity": artist['popularity'],
               "artist_photo_urls": [{'url': image['url']} for image in artist['images']],
               "artist_id": artist['id']} 
        
        results.append(val)
        
    return jsonify(results)

@app.route('/spoti/get_artist_albums/<username>/<artist_id_arr>')
def get_artist_album(username, artist_id_arr):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    artist_albums = sp.artist_albums(artist_id_arr)['items']
    for artist_album in artist_albums:
        val = {"artist_album_name": artist_album['name'],
               "album_release_year": artist_album['release_date'].split('-')[0],
               "artist_photo_url": [{'photo_url': image['url']} for image in artist_album['images']],
               "album_id": artist_album['id'],
               "artists_id": [{'artists_id': artist['id']} for artist in artist_album['artists']]} 
        
        results.append(val)
        
    return jsonify(results)

@app.route('/spoti/get_artist_top_tracks/<username>/<artist_id_arr>')
def get_artist_top_track(username, artist_id_arr):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    results = []
    artist_top_tracks = sp.artist_top_tracks(artist_id_arr)['tracks']
    for track in artist_top_tracks:
        val = {"track_name": track['name'],
               "album_name": track['album']['name'],
               "artist_names": [{'artist_name': artist['name']} for artist in track['artists']],
               "popularity": track['popularity'],
               "track_id": track['id'],
               "track_release_year": track['album']['release_date'].split('-')[0],               
               "track_duration_minutes": round(float(track['duration_ms']/1000/60), 2),
               "track_photo_urls": [{'photo_url': image['url']} for image in track['images']],
               "album_id": track['album']['id'],
               "artist_ids": [{'artist_id': artist['id']} for artist in track['artists']]} 
        
        results.append(val)
        
    return jsonify(results)

@app.route('/spoti/get_recommendations/<username>', methods=['POST'])
def get_recommendations(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    
    data = request.get_json()
    seed_tracks = data.get('seed_tracks')
    seed_artists = data.get('seed_artists')
    seed_albums = data.get('seed_albums')
    if data.get('seed_genres'):
        seed_genres = sp.recommendation_genre_seeds()
    else:
        seed_genres = None   
    
    results = []
    recommendation_tracks = sp.recommendations(seed_tracks=seed_tracks,
                                               seed_artists=seed_artists,
                                               seed_albums=seed_albums,
                                               seed_genres=seed_genres)['tracks']
    for track in recommendation_tracks:
        val = {"track_name": track['name'],
               "album_name": track['album']['name'],
               "artist_names": [{'artist_name': artist['name']} for artist in track['artists']],
               "popularity": track['popularity'],
               "track_id": track['id'],
               "track_release_year": track['album']['release_date'].split('-')[0],               
               "track_duration_minutes": round(float(track['duration_ms']/1000/60), 2),
               "track_photo_urls": [{'photo_url': image['url']} for image in track['images']],
               "album_id": track['album']['id'],
               "artist_ids": [{'artist_id': artist['id']} for artist in track['artists']]} 
        
        results.append(val)
        
    return jsonify(results)    
  
@app.route('/spoti/search/<username>', methods=['POST'])
def spoti_search():    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    
    data = request.get_json()
    q = data.get('query')
    type = data.get('type')    
    
    results = sp.search(q=q, type=type)  
    
    return jsonify(results)
   
@app.route('/api/check_spoti_connection/<username>')  
def check_spoti_connection(username):
    external_service = External_Service.query.filter_by(username=username).first()
    if external_service:
        return jsonify({'check': 'true'})
    else:
        return jsonify({'check': 'false'})

@app.route('/api/add_mobile_token/<username>', methods=['POST'])
def add_mobile_token():
    data = request.get_json()
        
    token_data = json.dumps(data.get('token_data'))
    
    external_service = External_Service.query.filter_by(username=username).first()
    if external_service:
        external_service.token_data = token_data
        return "User connection already in database, taken data refreshed"
            
    else:
        db.session.add(External_Service(username=username,
                                        service_name='Spotify',                                        
                                        token_data=token_data))
        db.session.commit()
        return "User connection added to the database."    
    
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

@app.route('/api/username', methods=['GET'])
def username():
    username = session['username']
    return jsonify({'username': username})

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
    
@app.route('/api/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
        
    return jsonify({'message': "Successful logout."})

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

@app.route('/api/add_song', methods=['POST'])
def add_song():
    data = request.get_json()
    song_name = data.get('song_name')
    username = data.get('username')
    
    if not song_name or not username:
        return jsonify({'error': 'A song name & username has to be given'}), 400

    if is_duplicate(data) != False:
        return jsonify({'error': 'Song already exists!', 'song_id of original': is_duplicate(data)}), 403

    new_song = Song(        
        song_name=data.get('song_name'),
        length=data.get('length'),
        tempo=data.get('tempo'),
        recording_type=data.get('recording_type'),
        listens=data.get('listens'),
        release_year=data.get('release_year'),
        added_timestamp=data.get('added_timestamp'),
        username=username
    )
    
    db.session.add(new_song) 
    db.session.commit()    
    
    if data.get('album_name'):
        song_album = Album.query.filter_by(name=data.get('album_name')).first()
        if not song_album:
            song_album = Album(name=data.get('album_name'), release_year=data.get('album_release_year'))
            db.session.add(song_album)
            db.session.commit()
                   
        new_song.add_album(song_album)
    
    if data.get('performer_name'):
        song_performer = Performer.query.filter_by(name=data.get('performer_name')).first()
        if not song_performer:
            song_performer = Performer(name=data.get('performer_name'))
            db.session.add(song_performer)
            db.session.commit()

        new_song.add_performer(song_performer)
        
    if data.get('genre'):
        song_genre = Genre.query.filter_by(name=data.get('genre')).first()
        if not song_genre:
            song_genre = Genre(name=data.get('genre'))
            db.session.add(song_genre)
            db.session.commit()
        
        new_song.add_genre(song_genre)
        
    if data.get('mood'):
        song_mood = Mood.query.filter_by(name=data.get('mood')).first()
        if not song_mood:
            song_mood = Mood(name=data.get('mood'))
            db.session.add(song_mood)
            db.session.commit()

        new_song.add_mood(song_mood)
        
    if data.get('instrument'):
        song_instrument = Instrument.query.filter_by(name=data.get('instrument')).first()
        if not song_instrument:
            song_instrument = Instrument(name=data.get('instrument'))
            db.session.add(song_instrument)  
            db.session.commit()   
    
        new_song.add_instrument(song_instrument)
        
    if data.get('external_song_id'):
        external_song_id = data.get('external_song_id')
        if is_duplicate_imported(external_song_id) != False:
            return jsonify({'error': 'Song already exists!', 'song_id of original': is_duplicate_imported(external_song_id)}), 403            
        else:
            new_song.add_imported_song(external_song_id)
    
    return jsonify({'message': f'{song_name} added successfully by {username}', 'song_id': new_song.song_id}), 200

@app.route('/api/add_songs_batch', methods=['POST'])
def add_songs_batch(): 
    data = request.get_json()  
    username = data.get('username')
    song_list = data.get('songs', [])
    
    if not username:
        return jsonify({'error': 'A username must be given'}), 400

    if not song_list or not isinstance(song_list, list):
        return jsonify({'error': 'A list of songs must be provided'}), 400     

    response_data = []

    for index, song in enumerate(song_list):
        song_name = song.get('song_name')        

        if not song_name:
            return jsonify({'error': f'A song name has to be given at the song number: {index}'}), 400            

        if is_duplicate(song) != False:
            return jsonify({'error': f'Song {song_name} already exists at the song number: {index}!', 'song_id of original': is_duplicate(song).song_id}), 403                        

        new_song = Song(
            song_name=song.get('song_name'),
            length=song.get('length'),
            tempo=song.get('tempo'),
            recording_type=song.get('recording_type'),
            listens=song.get('listens'),
            release_year=song.get('release_year'),
            username=username
        )
        
        db.session.add(new_song)
        db.session.commit()
    
        if song.get('album_name'):
            song_album = Album.query.filter_by(name=song.get('album_name')).first()
            if not song_album:
                song_album = Album(name=song.get('album_name'), release_year=song.get('album_release_year'))
                db.session.add(song_album)  
                db.session.commit()  
                
            new_song.add_album(song_album)   

    
        if song.get('performer_name'):
            song_performer = Performer.query.filter_by(name=song.get('performer_name')).first()
            if not song_performer:
                song_performer = Performer(name=song.get('performer_name'))
                db.session.add(song_performer)
                db.session.commit()
                
            new_song.add_performer(song_performer)
    
        if song.get('genre'):
            song_genre = Genre.query.filter_by(name=song.get('genre')).first()
            if not song_genre:
                song_genre = Genre(name=song.get('genre'))
                db.session.add(song_genre)
                db.session.commit()
                
            new_song.add_genre(song_genre)
        
        if song.get('mood'):
            song_mood = Mood.query.filter_by(name=song.get('mood')).first()
            if not song_mood:
                song_mood = Mood(name=song.get('mood'))
                db.session.add(song_mood)
                db.session.commit()
                
            new_song.add_mood(song_mood)
    
        if song.get('instrument'):
            song_instrument = Instrument.query.filter_by(name=song.get('instrument')).first()
            if not song_instrument:
                song_instrument = Instrument(name=song.get('instrument'))
                db.session.add(song_instrument) 
                db.session.commit()       
            
            new_song.add_instrument(song_instrument)
            
        if data.get('external_song_id'):
            external_song_id = data.get('external_song_id')
            if is_duplicate_imported(external_song_id):
                return jsonify({'error': 'Song already exists!', 'song_id of original': is_duplicate_imported(external_song_id)}), 403
            else:
                new_song.add_imported_song(external_song_id)          

        response_data.append({'message': f'{song_name} added successfully by {username}',  'song_id': new_song.song_id})

    return jsonify({'results': response_data}), 200

@app.route('/api/add_rate_batch', methods=['POST'])
def add_rate_batch(): 
    data = request.get_json()  
    username = data.get('username')
    ratings_list = data.get('ratings', [])
    
    if not username:
        return jsonify({'error': 'A username must be given'}), 400

    if not ratings_list or not isinstance(ratings_list, list):
        return jsonify({'error': 'A list of ratings must be provided'}), 400 
    
    response_data = []
    
    for index, rating in enumerate(ratings_list):        
        rating_type = rating.get('rating_type')
        
        if rating_type == 'song_rate':
            song_id = rating.get('song_id')
            rating = rating.get('rating')
            
            if not song_id or not rating:
                return jsonify({"error": f"song_name/rating is required in the line {index}"}), 400
            
            new_rating = User_Song_Rating(
                username=username,
                song_id=song_id,
                rating=rating
            )
            
            db.session.add(new_rating)
            
        elif rating_type == 'album_rate':
            album_id = rating.get('album_id')
            rating = rating.get('rating')
            
            if not album_id or not rating:
                return jsonify({"error": f"album_name/rating is required in the line {index}"}), 400
            
            new_rating = User_Album_Rating(
                username=username,
                album_id=album_id,
                rating=rating
            )
            
            db.session.add(new_rating)
            
        elif rating_type == 'performer_rate':
            performer_id = rating.get('performer_id')
            rating = rating.get('rating')
            
            if not performer_id or not rating:
                return jsonify({"error": f"performer_name/rating is required in the line {index}"}), 400
            
            new_rating = User_Performer_Rating(
                username=username,
                performer_id=performer_id,
                rating=rating
            )

            db.session.add(new_rating)
            
        else:
            return jsonify({"error": f"Unacceptable rate type in the line {index}"})
        
        db.session.commit()
        
        response_data.append({'message': f'Rating of type {rating_type} added successfully by {username}'})
    
    return jsonify({'results': response_data}), 200     
                

@app.route('/api/add_user_song_ratings', methods=['POST'])
def add_user_song_rating():
    data = request.get_json()

    username = data.get('username')
    song_id = data.get('song_id')
    rating = data.get('rating')
    
    if not username or not song_id or not rating:
        return jsonify({"error": "Username/song_name/rating are required"}), 400

    new_rating = User_Song_Rating(
        username=username,
        song_id=song_id,
        rating=rating
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": f"Song rating added successfully by {username}"}), 201

@app.route('/api/add_user_album_ratings', methods=['POST'])
def add_user_album_rating():
    data = request.get_json()

    username = data.get('username')
    album_id = data.get('album_id')
    rating = data.get('rating')

    if not username or not album_id or not rating:
        return jsonify({"error": "Username/album_name/rating are required"}), 400

    new_rating = User_Album_Rating(
        username=username,
        album_id=album_id,
        rating=rating
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": f"Album rating added successfully by {username}"}), 201

@app.route('/api/add_user_performer_ratings', methods=['POST'])
def add_user_performer_rating():
    data = request.get_json()

    username = data.get('username')
    performer_id = data.get('performer_id')
    rating = data.get('rating')

    if not username or not performer_id or not rating:
        return jsonify({"error": "Username/performer_name/rating are required"}), 400

    new_rating = User_Performer_Rating(
        username=username,
        performer_id=performer_id,
        rating=rating
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": f"Performer rating added successfully {username}"}), 201

@app.route('/api/display_followed_songs/<username>')
def display_followed_songs(username):
    user = username_to_user(username)
    followers = follower_finder(user)
    results = []
    if not followers:
        followers = []
    
    for follower in followers:
        f_user = username_to_user(follower) 
        val = {'username':f_user.username, 'songs': get_user_songs(f_user), }
        results.append(val)
        
    return jsonify(results)

@app.route('/api/remove_song', methods=['POST'])
def remove_song():
    data = request.get_json() 
    username = data.get('username')   
    song_name = data.get('songname')        
    
    if not song_name:
        return jsonify({'error': 'A song_name has to be given'}), 400

    song = song_name_to_song(song_name)   
    
    if not song:
        return jsonify({'error': 'Song not found'}), 404

    db.session.delete(song)
    db.session.commit()

    return jsonify({'message': f'{song_name} removed successfully by {username}'}), 200

@app.route('/api/user_songs', methods=['POST'])
def user_songs():
    data = request.get_json()
    username = data.get('username')
    
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400        
    
    user_songs = Song.query.filter_by(username=username)
    
    if not user_songs:
        user_song_details = []    
    
    user_song_details = [
        {'song_id': song.song_id,
         'song_name': song.song_name,
         'length': str(song.length),
         'tempo': song.tempo,
         'recording_type': song.recording_type,
         'listens': song.listens,
         'release_year': song.release_year,
         'added_timestamp': song.added_timestamp,
         'username': song.username,
         'album_name': song_name_to_album_name(song.song_name),
         'performer_name': song_name_to_performer_name(song.song_name),
         'mood': song_name_to_mood_name(song.song_name),
         'genre': song_name_to_genre_name(song.song_name),
         'instrument': song_name_to_instrument_name(song.song_name)}
        for song in user_songs 
    ]
    
    return jsonify(user_song_details), 200

@app.route('/api/all_song_ratings')
def all_song_ratings():
    every_song_ratings = User_Song_Rating.query.all()
    if not every_song_ratings:
        every_song_ratings = []
        
    ratings_data = [{"username": rating.username,
                     "song_id": rating.song_id,
                     "genre": song_name_to_genre_name(song_id_to_song_name(rating.song_id)),
                     "artist": song_name_to_performer_name(song_id_to_song_name(rating.song_id)),
                     "album": song_name_to_album_name(song_id_to_song_name(rating.song_id)),
                     "song": song_id_to_song_name(rating.song_id),
                     "song_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp,
                     "external_service_id" : song_id_to_imported_song(rating.song_id)} for rating in every_song_ratings]   

    
    return jsonify(ratings_data)

@app.route('/api/all_album_ratings')
def all_album_ratings():
    every_song_ratings = User_Album_Rating.query.all()
    if not every_song_ratings:
        every_song_ratings = []
    
    ratings_data = [{"username": rating.username,                     
                     "album": album_id_to_album(rating.album_id).name,                     
                     "album_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp} for rating in every_song_ratings]
    
    return jsonify(ratings_data)

@app.route('/api/all_performer_ratings')
def all_performer_ratings():
    every_song_ratings = User_Performer_Rating.query.all()
    if not every_song_ratings:
        every_song_ratings = []
    
    ratings_data = [{"username": rating.username,                     
                     "album": performer_id_to_performer(rating.performer_id).name,                     
                     "performer_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp} for rating in every_song_ratings]
    
    return jsonify(ratings_data)

@app.route('/api/follower_song_ratings/<username>')
def get_follower_song_ratings(username):
    user = username_to_user(username)
    follower_usernames = follower_finder(user)
    for follower_username in follower_usernames:
        user_ratings = User_Song_Rating.query.filter_by(username=follower_username).all()
    
    ratings_data = [{"username": rating.username,
                     "song_id": rating.song_id,
                     "genre": song_name_to_genre_name(song_id_to_song_name(rating.song_id)),
                     "artist": song_name_to_performer_name(song_id_to_song_name(rating.song_id)),
                     "album": song_name_to_album_name(song_id_to_song_name(rating.song_id)),
                     "song": song_id_to_song_name(rating.song_id),
                     "song_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp,
                     "external_service_id" : song_id_to_imported_song(rating.song_id)} for rating in user_ratings]   
    
    
    return jsonify(ratings_data)

@app.route('/api/follower_album_ratings/<username>')
def get_follower_album_ratings(username):
    user = username_to_user(username)
    follower_usernames = follower_finder(user)
    for follower_username in follower_usernames:
        user_ratings = User_Album_Rating.query.filter_by(username=follower_username).all()
    
    ratings_data = [{"username": rating.username,                     
                     "album": album_id_to_album(user_ratings.album_id).name,                     
                     "album_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    
    return jsonify(ratings_data)

@app.route('/api/follower_performer_ratings/<username>')
def get_follower_performer_ratings(username):
    user = username_to_user(username)
    follower_usernames = follower_finder(user)
    for follower_username in follower_usernames:
        user_ratings = User_Performer_Rating.query.filter_by(username=follower_username).all()
    
    ratings_data = [{"username": rating.username,                     
                     "performer": performer_id_to_performer(user_ratings.performer_id).name,                     
                     "performer_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    
    return jsonify(ratings_data)

@app.route('/api/group_song_ratings/<username>/<group_id>')
def get_group_song_ratings(username, group_id):    
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    results = group_song_ratings(group_id)
    if not results:
        results = []       
    
    
    return jsonify(results)

@app.route('/api/group_album_ratings/<username>/<group_id>')
def get_group_album_ratings(group_id):    
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    results = group_album_ratings(group_id)
    if not results:
        results = []
    
    return jsonify(results)

@app.route('/api/group_performer_ratings/<username>/<group_id>')
def get_group_performer_ratings(group_id):    
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    results = group_performer_ratings(group_id)
    if not results:
        results = []
    
    return jsonify(results)

@app.route('/api/user_song_ratings/<username>')
def get_user_song_ratings(username):    
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400    
    user_ratings = User_Song_Rating.query.filter_by(username=username).all()
    if not user_ratings:
        user_ratings = []
        
    ratings_data = [{"song_id": rating.song_id,
                     "genre": song_name_to_genre_name(song_id_to_song_name(rating.song_id)),
                     "artist": song_name_to_performer_name(song_id_to_song_name(rating.song_id)),
                     "album": song_name_to_album_name(song_id_to_song_name(rating.song_id)),
                     "song": song_id_to_song_name(rating.song_id),
                     "song_rating": rating.rating,                     
                     "rating_timestamp": rating.rating_timestamp,
                     "external_service_id" : song_id_to_imported_song(rating.song_id)} for rating in user_ratings]
    
   
    
    return jsonify({f"{username}_song_ratings": ratings_data})

@app.route('/api/user_album_ratings', methods=['POST'])
def get_user_album_ratings():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    user_ratings = User_Album_Rating.query.filter_by(username=username).all()
    ratings_data = [{"album_id": rating.album_id, "rating": rating.rating, "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    return jsonify({"user_album_ratings": ratings_data})

@app.route('/api/user_performer_ratings', methods=['POST'])
def get_user_performer_ratings():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    user_ratings = User_Performer_Rating.query.filter_by(username=username).all()
    ratings_data = [{"performer_id": rating.performer_id, "rating": rating.rating, "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    return jsonify({"user_performer_ratings": ratings_data})

@app.route('/api/user_genre_preference', methods=['POST'])
def user_genre_preferences():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    genres = db.session.query(Genre.name, db.func.count(Song_Genre.song_id).label('count')) \
        .join(Song_Genre, Genre.genre_id == Song_Genre.genre_id) \
        .join(Song, Song_Genre.song_id == Song.song_id) \
        .filter(Song.username == username) \
        .group_by(Genre.name) \
        .order_by(db.func.count(Song_Genre.song_id).desc()) \
        .all()
        
    genre_preferences = {'genres': [{'genre': genre, 'count': count} for genre, count in genres]}
    
    return jsonify(genre_preferences)

@app.route('/api/user_album_preference', methods=['POST'])
def user_album_preferences():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    albums = db.session.query(Album.name, db.func.count(Song_Album.song_id).label('count')) \
        .join(Song_Album, Album.album_id == Song_Album.album_id) \
        .join(Song, Song_Album.song_id == Song.song_id) \
        .filter(Song.username == username) \
        .group_by(Album.name) \
        .order_by(db.func.count(Song_Album.song_id).desc()) \
        .all()
        
    album_preferences = {'albums': [{'album': album, 'count': count} for album, count in albums]}
    
    return jsonify(album_preferences)

@app.route('/api/user_performer_preference', methods=['POST'])
def user_performer_preferences():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    performers = db.session.query(Performer.name, db.func.count(Song_Performer.song_id).label('count')) \
        .join(Song_Performer, Performer.performer_id == Song_Performer.performer_id) \
        .join(Song, Song_Performer.song_id == Song.song_id) \
        .filter(Song.username == username) \
        .group_by(Performer.name) \
        .order_by(db.func.count(Song_Performer.song_id).desc()) \
        .all()
        
    performer_preferences = {'performers': [{'performer': performer, 'count': count} for performer, count in performers]}
    
    return jsonify(performer_preferences)

@app.route('/api/user_followings_genre_preference', methods=['POST'])
def user_followings_genre():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    user = username_to_user(username)
    followed_usernames = followed_finder(user)
    
    if not followed_usernames:
        return {'message': 'User does not follow anyone'}, 200
    
    genres = []
    for followed_username in followed_usernames:
        song_list = Song.query.filter_by(username=followed_username).all()
        for song in song_list:
            genres.append(song_name_to_genre_name(song.username))

    genre_count = {}
    for genre in genres:
        if genre in genre_count:
            genre_count[genre] += 1
        else:
            genre_count[genre] = 1
            
    genre_preferences = {'genres': [{'genre': genre, 'count': count} for genre, count in genre_count.items()]}
    
    return jsonify(genre_preferences)

@app.route('/api/user_followings_album_preference', methods=['POST'])
def user_followings_album():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    user = username_to_user(username)
    followed_usernames = followed_finder(user)
    
    if not followed_usernames:
        return {'message': 'User does not follow anyone'}, 200
    
    albums = []
    for followed_username in followed_usernames:
        song_list = Song.query.filter_by(username=followed_username).all()
        for song in song_list:
            albums.append(song_name_to_album_name(song.username))

    album_count = {}
    for album in albums:
        if album in album_count:
            album_count[album] += 1
        else:
            album_count[album] = 1
            
    album_preferences = {'albums': [{'album': album, 'count': count} for album, count in album_count.items()]}
    
    return jsonify(album_preferences)
    
@app.route('/api/user_followings_performer_preference', methods=['POST'])
def user_followings_performer():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'A username has to be given'}), 400
    
    user = username_to_user(username)
    followed_usernames = followed_finder(user)
    
    if not followed_usernames:
        return {'message': 'User does not follow anyone'}, 200
    
    performers = []
    for followed_username in followed_usernames:
        song_list = Song.query.filter_by(username=followed_username).all()
        for song in song_list:
            performers.append(song_name_to_performer_name(song.username))

    performer_count = {}
    for performer in performers:
        if performer in performer_count:
            performer_count[performer] += 1
        else:
            performer_count[performer] = 1
            
    performer_preferences = {'performers': [{'performer': performer, 'count': count} for performer, count in performer_count.items()]}
    
    return jsonify(performer_preferences) 

@app.route('/api/form_groups', methods=['POST'])
def api_form_groups():
    data = request.get_json()
    user_arr = data.get('user_arr')
    group_name = data.get('group_name')
    
    if len(user_arr) < 2:
        return "There must be at least 2 people to form a group.", 400
    
    if not group_name:
        return "Group name has to be specified.", 400    
    
    form_group(group_name, user_arr)
    return jsonify({'message': f'{group_name} with {len(user_arr)} users has been formed.'}), 200

@app.route('/api/display_user_group/<username>')
def display_user_group(username):        
    return jsonify(username_to_groups(username)), 200
 

@app.route('/api/add_user_to_group', methods=['POST'])
def add_user_to_group():
    data = request.get_json()
    username = data.get('username')
    group_id = data.get('group_id')
    if not group_id or not username:
        return "Group id and username have to be specified.", 400
    
    user = username_to_user(username)
    group = group_id_to_group(group_id)    
    
    user.add_to_group(group)
    return jsonify({'message': f'{username} has been successfully added to the group `{group.group_name}.'})
    
@app.route('/api/remove_user_from_group', methods=['POST'])
def remove_user_from_group():
    data = request.get_json()
    username = data.get('username')
    group_id = data.get('group_id')
    if not group_id or not username:
        return "Group id and username have to be specified.", 400
    
    user = username_to_user(username)
    group = group_id_to_group(group_id)
    
    user.remove_from_group(group)    
    return jsonify({'message': f'{username} has been successfully removed from the group `{group.group_name}.'})

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

@app.route('/api/get_all_songs_info')
def get_all_song_info():
    all_users = users.query.all()
    if not all_users:
        all_users = []  
    
    results = []
    
    for user in all_users:         
        val = {'username':user.username, 'songs': get_user_songs(user)}
        results.append(val)
        
    return jsonify(results)
        
     
        
@app.route('/api/group_get_all_songs/<group_id>')
def group_get_all_songs(group_id):
    group_members_names = get_group_members(group_id)
    results = []
    if not all_users:
        all_users = []
    
    for member_name in group_members_names:
        val = {'username':member_name, 'songs': get_user_songs(username_to_user(member_name))}
        results.append(val)
        
    return jsonify(results)    
    

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)