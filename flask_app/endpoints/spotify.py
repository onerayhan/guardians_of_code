#Interfile imports 
from app import app, db
from utils import generate_random_state, create_spotify_oauth, get_token
from song_models import External_Service

#Library imports
from flask import session, redirect, request, jsonify
import spotipy
from datetime import datetime, timedelta, timezone
import json

# Spotify login endpoint that redirects user to spotify authorization page
@app.route('/spoti_login/<username>')
def spoti_login(username):   
    state = generate_random_state()
    session['state'] = state
    session['username'] = username   

    auth = create_spotify_oauth(state=state)
        
    auth_url = auth.get_authorize_url()
    return redirect(auth_url)     

# Callback endpoint to catch user token data and then parse it to the database
# Callback route given to the spotify developer dashboard for sending token data
@app.route('/callback')
def callback(): 
        
    try:
        code = request.args.get('code')
        state = request.args.get('state')

        if state != session.get('state'):
            return "Invalid state parameter. Possible CSRF attack."         

        sp_oauth = create_spotify_oauth()
        username = session['username']
        token_data = sp_oauth.get_access_token(code)
        
        if token_data:
            
            external_service = External_Service.query.filter_by(username=username).first()
            if external_service:
                return jsonify({'error': 'Connection already exists.'}), 409
            
            else:
                expires_at_utc = datetime.utcfromtimestamp(token_data['expires_at']).replace(tzinfo=timezone.utc)                
                turkey_timezone = timezone(timedelta(hours=3))
                expires_at_turkey = expires_at_utc.astimezone(turkey_timezone)
                
                
                db.session.add(External_Service(username=username,
                                                service_name='Spotify',                                                
                                                access_token=token_data['access_token'],
                                                refresh_token=token_data['refresh_token'],
                                                expires_at=expires_at_turkey))
                db.session.commit()   
            
                return jsonify({'message': f'{username} spotify connection established.'}), 200                     

        else:
            "Token Request Failed", 500

    except Exception as e:
        app.logger.error(f"Error in callback: {e}")
        return "Fail in callback", 500   

# Getting the specified users currently saved tracks 
@app.route('/spoti/get_curr_user_tracks/<username>')
def get_curr_user_tracks(username):     
    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    track_list = sp.current_user_saved_tracks(limit=10)['items']    
    return jsonify(track_list)

# Getting users top listened to tracks
@app.route('/spoti/get_user_top_tracks/<username>')
def get_user_top_tracks(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)    
    track_list = sp.current_user_top_tracks(limit=10)['items']    
    return jsonify(track_list)

# Getting tracks info by the input track id array
@app.route('/spoti/get_tracks_info/<username>', methods=['POST'])
def get_tracks_info(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    
    data = request.get_json()
    track_id_arr = data.get('track_id_arr')
    
    sp = spotipy.Spotify(auth=access_token)
    tracks_info = sp.tracks(track_id_arr)['tracks']
    return jsonify(tracks_info)

# Getting albums info by the input album id array
@app.route('/spoti/get_albums_info/<username>', methods=['POST'])
def get_albums_info(username):
    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    
    data = request.get_json()
    album_id_arr = data.get('album_id_arr')
    
    sp = spotipy.Spotify(auth=access_token)    
    albums = sp.albums(album_id_arr)['albums']        
    return jsonify(albums)

# Getting artists info by the input artist id array
@app.route('/spoti/get_artists_info/<username>', methods=['POST'])
def get_artists_info(username):
    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    
    data = request.get_json()
    artist_id_arr = data.get('artist_id_arr')
    
    sp = spotipy.Spotify(auth=access_token)    
    artists = sp.artists(artist_id_arr)['artists']       
    return jsonify(artists)

# Getting an artist's albums by by entering his/her artist id
@app.route('/spoti/get_artist_albums/<username>', methods=['POST'])
def get_artist_album(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    
    data = request.get_json()
    artist_id = data.get('artist_id')
    
    sp = spotipy.Spotify(auth=access_token)    
    artist_albums = sp.artist_albums(artist_id)['items']       
    return jsonify(artist_albums)

# Getting an artist's top listened to tracks by getting his/her artist id
@app.route('/spoti/get_artist_top_tracks/<username>', methods=['POST'])
def get_artist_top_track(username):        
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    
    data = request.get_json()
    artist_id = data.get('artist_id')
    
    sp = spotipy.Spotify(auth=access_token)    
    artist_top_tracks = sp.artist_top_tracks(artist_id)['tracks']
    return jsonify(artist_top_tracks)

# Getting the recommended songs for user through the spotify recommondation algorithm
# Input seeds for tracks, artists and albums along with genres (optional)
# Look at spotify web api for more detail
@app.route('/spoti/get_recommendations/<username>', methods=['POST'])
def get_recommendations(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    
    data = request.get_json()
    seed_tracks = data.get('seed_tracks')
    seed_artists = data.get('seed_artists')    
    seed_genres = data.get('seed_genres') or sp.recommendation_genre_seeds()
    
    if not seed_tracks or not seed_artists or not seed_genres:
        return jsonify({"error": "seed_tracks, seed_artists and see_genres must be given!"})    
    
    if isinstance(seed_genres, str):
        seed_genres = [seed_genres]
    
    recommendation_tracks = sp.recommendations(seed_tracks=seed_tracks,
                                               seed_artists=seed_artists,                                               
                                               seed_genres=seed_genres)['tracks']   
        
    return jsonify(recommendation_tracks)    

# Spotify searching mechanishm for the given user, can be modified for albums, songs etc.
# Look at spotify web api for more detail 
@app.route('/spoti/search/<username>', methods=['POST'])
def spoti_search(username):    
    access_token, authorized = get_token(username)    
    if not authorized:
        return "Unauthorized access"
    sp = spotipy.Spotify(auth=access_token)
    
    data = request.get_json()
    q = data.get('query')       
    type = data.get('type') 
    
    if not q or not type:
        return jsonify({"error": "query and type must be given!"})    
    
    results = sp.search(q=q, type=type)  
    
    return jsonify(results)

# Checking the spotify connection of the user (solely for frontend 'connection established' displayment)  
@app.route('/api/check_spoti_connection/<username>')  
def check_spoti_connection(username):
    external_service = External_Service.query.filter_by(username=username).first()
    if external_service:
        return jsonify({'check': 'true'})
    else:
        return jsonify({'check': 'false'})

# Specific for the given project for mobile application side to input the token data
@app.route('/api/add_mobile_token/<username>', methods=['POST'])
def add_mobile_token(username):
    data = request.get_json()
    token_data = json.dumps(data.get('token_data'))  
    
    
    if not token_data:
        return jsonify({'error':"No token data given"}), 404
    
    external_service = External_Service.query.filter_by(username=username).first()
    if external_service:        
        return jsonify({'message':"User already has a connection in database"}), 200
            
    else:
        expires_at_utc = datetime.utcfromtimestamp(token_data['expires_at']).replace(tzinfo=timezone.utc)                
        turkey_timezone = timezone(timedelta(hours=3))
        expires_at_turkey = expires_at_utc.astimezone(turkey_timezone)
                
                
        db.session.add(External_Service(username=username,
                                        service_name='Spotify',                                                
                                        access_token=token_data['access_token'],
                                        refresh_token=token_data['refresh_token'],
                                        expires_at=expires_at_turkey))
        db.session.commit()
        return jsonify({'message':"User already has a connection in database"}), 200