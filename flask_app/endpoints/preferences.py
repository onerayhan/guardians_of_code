#Interfile imports 
from app import app, db
from utils import username_to_user, followed_finder, song_name_to_genre_name, song_name_to_album_name, song_name_to_performer_name, get_user_groups, get_group_members
from song_models import Song, Genre, Album, Performer
from song_models import Song_Genre, Song_Album, Song_Performer

#Library imports
from flask import request, jsonify

# Filtering all of the users added songs on the basis of genre and its count i.e preference
@app.route('/api/user_genre_preference/<username>')
def user_genre_prf(username):
    genres = db.session.query(Genre.name, db.func.count(Song_Genre.song_id).label('count')) \
        .join(Song_Genre, Genre.genre_id == Song_Genre.genre_id) \
        .join(Song, Song_Genre.song_id == Song.song_id) \
        .filter(Song.username == username) \
        .group_by(Genre.name) \
        .order_by(db.func.count(Song_Genre.song_id).desc()) \
        .all()
        
    genre_preferences = {'genres': [{'genre': genre, 'count': count} for genre, count in genres]}
    
    return jsonify(genre_preferences)

# Filtering all of the users added songs on the basis of album and its count i.e preference
@app.route('/api/user_album_preference/<username>')
def user_album_prf(username):
    albums = db.session.query(Album.name, db.func.count(Song_Album.song_id).label('count')) \
        .join(Song_Album, Album.album_id == Song_Album.album_id) \
        .join(Song, Song_Album.song_id == Song.song_id) \
        .filter(Song.username == username) \
        .group_by(Album.name) \
        .order_by(db.func.count(Song_Album.song_id).desc()) \
        .all()
        
    album_preferences = {'albums': [{'album': album, 'count': count} for album, count in albums]}
    
    return jsonify(album_preferences)

# Filtering all of the users added songs on the basis of performer and its count i.e preference
@app.route('/api/user_performer_preference/<username>')
def user_performer_prf(username):    
    performers = db.session.query(Performer.name, db.func.count(Song_Performer.song_id).label('count')) \
        .join(Song_Performer, Performer.performer_id == Song_Performer.performer_id) \
        .join(Song, Song_Performer.song_id == Song.song_id) \
        .filter(Song.username == username) \
        .group_by(Performer.name) \
        .order_by(db.func.count(Song_Performer.song_id).desc()) \
        .all()
        
    performer_preferences = {'performers': [{'performer': performer, 'count': count} for performer, count in performers]}
    
    return jsonify(performer_preferences)

# Filtering all of the users followings' added songs on the basis of genre and its count i.e preference
@app.route('/api/user_followings_genre_preference/<username>')
def user_followings_genre_prf(username):     
    user = username_to_user(username)
    followed_usernames = followed_finder(user)
    
    if not followed_usernames:
        return {'message': 'User does not follow anyone'}, 200
    
    genres = []
    for followed_username in followed_usernames:
        song_list = Song.query.filter_by(username=followed_username).all()
        for song in song_list:
            genres.append(song_name_to_genre_name(song.song_name))

    genre_count = {}
    for genre in genres:
        if genre in genre_count:
            genre_count[genre] += 1
        else:
            genre_count[genre] = 1
            
    genre_preferences = {'genres': [{'genre': genre, 'count': count} for genre, count in genre_count.items()]}
    
    return jsonify(genre_preferences)

# Filtering all of the users followings' added songs on the basis of album and its count i.e preference
@app.route('/api/user_followings_album_preference/<username>')
def user_followings_album_prf(username):     
    user = username_to_user(username)
    followed_usernames = followed_finder(user)
    
    if not followed_usernames:
        return {'message': 'User does not follow anyone'}, 200
    
    albums = []
    for followed_username in followed_usernames:
        song_list = Song.query.filter_by(username=followed_username).all()
        for song in song_list:
            albums.append(song_name_to_album_name(song.song_name))

    album_count = {}
    for album in albums:
        if album in album_count:
            album_count[album] += 1
        else:
            album_count[album] = 1
            
    album_preferences = {'albums': [{'album': album, 'count': count} for album, count in album_count.items()]}
    
    return jsonify(album_preferences)

# Filtering all of the users followings' added songs on the basis of performer and its count i.e preference   
@app.route('/api/user_followings_performer_preference/<username>')
def user_followings_performer_prf(username):
    user = username_to_user(username)
    followed_usernames = followed_finder(user)
    
    if not followed_usernames:
        return {'message': 'User does not follow anyone'}, 200
    
    performers = []
    for followed_username in followed_usernames:
        song_list = Song.query.filter_by(username=followed_username).all()
        for song in song_list:
            performers.append(song_name_to_performer_name(song.song_name))

    performer_count = {}
    for performer in performers:
        if performer in performer_count:
            performer_count[performer] += 1
        else:
            performer_count[performer] = 1
            
    performer_preferences = {'performers': [{'performer': performer, 'count': count} for performer, count in performer_count.items()]}
    
    return jsonify(performer_preferences)

@app.route('/api/group_genre_preference/<username>')
def group_genre_prf(username):
    groups = get_user_groups(username)  
    
    if not groups:
        return {'message': 'User does not belong to any group'}, 200 
    
    genres = []
    for group in groups:
        members_usernames = get_group_members(group.group_id)
        for member_username in members_usernames:
            song_list = Song.query.filter_by(username=member_username).all()
            for song in song_list:
               genres.append(song_name_to_genre_name(song.song_name)) 
        
    genre_count = {}
    for genre in genres:
        if genre in genre_count:
            genre_count[genre] += 1
        else:
            genre_count[genre] = 1
            
    genre_preferences = {'genres': [{'genre': genre, 'count': count} for genre, count in genre_count.items()]}
    
    return jsonify(genre_preferences)

@app.route('/api/group_album_preference/<username>')
def group_album_prf(username):
    groups = get_user_groups(username)  
    
    if not groups:
        return {'message': 'User does not belong to any group'}, 200 
    
    albums = []
    for group in groups:
        members_usernames = get_group_members(group.group_id)
        for member_username in members_usernames:
            song_list = Song.query.filter_by(username=member_username).all()
            for song in song_list:
               albums.append(song_name_to_album_name(song.song_name))  
    
    album_count = {}
    for album in albums:
        if album in album_count:
            album_count[album] += 1
        else:
            album_count[album] = 1
            
    album_preferences = {'albums': [{'album': album, 'count': count} for album, count in album_count.items()]}
    
    return jsonify(album_preferences)

@app.route('/api/group_performer_preference/<username>')
def group_performer_prf(username):
    groups = get_user_groups(username)  
    
    if not groups:
        return {'message': 'User does not belong to any group'}, 200 
    
    performers = []
    for group in groups:
        members_usernames = get_group_members(group.group_id)
        for member_username in members_usernames:
            song_list = Song.query.filter_by(username=member_username).all()
            for song in song_list:
               performers.append(song_name_to_performer_name(song.song_name)) 
               
    performer_count = {}
    for performer in performers:
        if performer in performer_count:
            performer_count[performer] += 1
        else:
            performer_count[performer] = 1
            
    performer_preferences = {'performers': [{'performer': performer, 'count': count} for performer, count in performer_count.items()]}
    
    return jsonify(performer_preferences)

@app.route('/api/get_all_genre_preference')
def get_all_genre_preference():
    all_songs = Song.query.all()
    
    genres = []
    for song in all_songs:
        genres.append(song_name_to_genre_name(song.song_name))  
    
    genre_count = {}
    for genre in genres:
        if genre in genre_count:
            genre_count[genre] += 1
        else:
            genre_count[genre] = 1
            
    genre_preferences = {'genres': [{'genre': genre, 'count': count} for genre, count in genre_count.items()]}
    
    return jsonify(genre_preferences)

@app.route('/api/get_all_album_preference')
def get_all_album_preference():
    all_songs = Song.query.all()
    
    albums = []
    for song in all_songs:
        albums.append(song_name_to_album_name(song.song_name))  
    
    album_count = {}
    for album in albums:
        if album in album_count:
            album_count[album] += 1
        else:
            album_count[album] = 1
            
    album_preferences = {'albums': [{'album': album, 'count': count} for album, count in album_count.items()]}
    
    return jsonify(album_preferences)
    
@app.route('/api/get_all_performer_preference')
def get_all_performer_preference():
    all_songs = Song.query.all()
    
    performers = []
    for song in all_songs:
        performers.append(song_name_to_performer_name(song.song_name))
    
    performer_count = {}
    for performer in performers:
        if performer in performer_count:
            performer_count[performer] += 1
        else:
            performer_count[performer] = 1
            
    performer_preferences = {'performers': [{'performer': performer, 'count': count} for performer, count in performer_count.items()]}
    
    return jsonify(performer_preferences)      