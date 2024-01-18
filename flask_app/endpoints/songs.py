#Interfile imports 
from app import app, db
from utils import is_duplicate, is_duplicate_imported, username_to_user, song_name_to_album_name, song_name_to_genre_name, song_name_to_instrument_name, song_name_to_mood_name, song_name_to_performer_name
from utils import followed_finder, get_user_songs, song_id_to_song, get_group_members, get_user_groups
from song_models import Song, Album, Performer, Genre, Mood, Instrument
from models import users

#Library imports
from flask import request, jsonify

# Adding a song along with its album, genre and performer/artist
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

# Adding a songs in batch along with its album, genre and performer/artist
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
            return jsonify({'error': f'Song {song_name} already exists at the song number: {index}!', 'song_id of original': is_duplicate(song)}), 403                        

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

# Removing the given song from the database
@app.route('/api/remove_song', methods=['POST'])
def remove_song():
    data = request.get_json() 
    username = data.get('username')   
    song_id = data.get('song_id')        
    
    if not song_id:
        return jsonify({'error': 'A song_id has to be given'}), 400

    song = song_id_to_song(song_id) 
    song_name = song.song_name
    
    if not song:
        return jsonify({'error': 'Song not found'}), 404

    db.session.delete(song)
    db.session.commit()

    return jsonify({'message': f'{song_name} removed successfully by {username}'}), 200

# Displaying a given user's songs
@app.route('/api/user_songs/<username>')
def user_songs(username):   
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

# Displaying the songs of the users that the given user follows
@app.route('/api/display_followed_songs/<username>')
def display_followed_songs(username):
    user = username_to_user(username)
    followings = followed_finder(user)
    results = []
    if not followings:
        return jsonify([]) 
    
    for followed in followings:
        f_user = username_to_user(followed) 
        val = {'username':f_user.username, 'songs': get_user_songs(f_user), }
        results.append(val)
        
    return jsonify(results)

# Getting all the songs in the database 
@app.route('/api/get_all_songs_info')
def get_all_song_info():
    all_users = users.query.all()
    if not all_users:
        return jsonify([])   
    
    results = []
    
    for user in all_users:         
        val = {'username':user.username, 'songs': get_user_songs(user)}
        results.append(val)
        
    return jsonify(results)    
    
# Getting all the songs of a group    
@app.route('/api/group_get_all_songs/<group_id>')
def group_get_all_songs(group_id):    
    group_members_names = get_group_members(group_id)
    results = []
    if not group_members_names:
        return jsonify([]) 
    
    for member_name in group_members_names:
        val = {'username':member_name, 'songs': get_user_songs(username_to_user(member_name))}
        results.append(val)
        
    return jsonify(results)

# Getting all the songs of a user is part of
@app.route('/api/get_user_group_songs/<username>')
def get_user_group_songs(username):
    groups = get_user_groups(username)  
    
    if not groups:
        return jsonify([]) 
    
    results = []
    for group in groups:
        members_names = get_group_members(group.group_id)
        for member_name in members_names:
            if member_name != username:
                val = {'username':member_name, 'songs': get_user_songs(username_to_user(member_name))}
                results.append(val)  

    return jsonify(results)