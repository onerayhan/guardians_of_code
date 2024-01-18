#Interfile imports 
from app import app, db
from utils import username_to_user, song_name_to_genre_name, song_name_to_album_name, song_name_to_performer_name, song_id_to_song_name, album_name_to_album, performer_name_to_performer
from utils import album_id_to_album, performer_id_to_performer, group_song_ratings, group_album_ratings, group_performer_ratings, song_id_to_imported_song, follower_finder
from song_models import User_Song_Rating, User_Album_Rating, User_Performer_Rating

#Library imports
from flask import request, jsonify

# Adding ratings for songs, albums and performer if given in the specified manner in the json
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
                
# Add rating for the given song with the user
@app.route('/api/add_user_song_ratings', methods=['POST'])
def add_user_song_rating():
    data = request.get_json()

    username = data.get('username')
    song_id = data.get('song_id')
    rating = data.get('rating')
    
    if not username or not song_id or not rating:
        return jsonify({"error": "Username/song_id/rating are required"}), 400

    new_rating = User_Song_Rating(
        username=username,
        song_id=song_id,
        rating=rating
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": f"Song rating added successfully by {username}"}), 201

# Add rating for the given album with the user
@app.route('/api/add_user_album_ratings', methods=['POST'])
def add_user_album_rating():
    data = request.get_json()

    username = data.get('username')
    album_name = data.get('album_name')
    rating = data.get('rating')

    if not username or not album_name or not rating:
        return jsonify({"error": "Username/album_id/rating are required"}), 400

    new_rating = User_Album_Rating(
        username=username,
        album_id=album_name_to_album(album_name).album_id,
        rating=rating
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": f"Album rating added successfully by {username}"}), 201

# Add rating for the given performer with the user
@app.route('/api/add_user_performer_ratings', methods=['POST'])
def add_user_performer_rating():
    data = request.get_json()

    username = data.get('username')
    performer_name = data.get('performer_name')
    rating = data.get('rating')

    if not username or not performer_name or not rating:
        return jsonify({"error": "Username/performer_id/rating are required"}), 400

    new_rating = User_Performer_Rating(
        username=username,
        performer_id=performer_name_to_performer(performer_name).performer_id,
        rating=rating
    )

    db.session.add(new_rating)
    db.session.commit()

    return jsonify({"message": f"Performer rating added successfully {username}"}), 201

# Retreive all song ratings along with the associated album and performer
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

#Retreive all album ratings
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

#Retreive all performer ratings
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

#Retreive all follower song ratings
@app.route('/api/follower_song_ratings/<username>')
def get_follower_song_ratings(username):
    user = username_to_user(username)
    follower_usernames = follower_finder(user)
    if not follower_usernames:
        return jsonify([])
    
    user_ratings = []
    for follower_username in follower_usernames:
        ratings = User_Performer_Rating.query.filter_by(username=follower_username).all()
        for rating in ratings:
            user_ratings.append(rating)
    
    
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

#Retreive all follower album ratings
@app.route('/api/follower_album_ratings/<username>')
def get_follower_album_ratings(username):
    user = username_to_user(username)
    follower_usernames = follower_finder(user)
    if not follower_usernames:
        return jsonify([])
    
    user_ratings = []
    for follower_username in follower_usernames:
        ratings = User_Performer_Rating.query.filter_by(username=follower_username).all()
        for rating in ratings:
            user_ratings.append(rating)
    
    ratings_data = [{"username": rating.username,                     
                     "album": album_id_to_album(user_ratings.album_id).name,                     
                     "album_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    
    return jsonify(ratings_data)

#Retreive all follower performer ratings
@app.route('/api/follower_performer_ratings/<username>')
def get_follower_performer_ratings(username):
    user = username_to_user(username)
    follower_usernames = follower_finder(user)
    if not follower_usernames:
        return jsonify([])
    
    user_ratings = []
    for follower_username in follower_usernames:
        ratings = User_Performer_Rating.query.filter_by(username=follower_username).all()
        for rating in ratings:
            user_ratings.append(rating)
    
    ratings_data = [{"username": rating.username,                     
                     "performer": performer_id_to_performer(user_ratings.performer_id).name,                     
                     "performer_rating": rating.rating,
                     "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    
    return jsonify(ratings_data)

#Retreive all group song ratings
@app.route('/api/group_song_ratings/<group_id>')
def get_group_song_ratings(group_id):     
    results = group_song_ratings(group_id)
    if not results:
        results = []       
    
    
    return jsonify(results)

#Retreive all group album ratings
@app.route('/api/group_album_ratings/<group_id>')
def get_group_album_ratings(group_id):   
    results = group_album_ratings(group_id)
    if not results:
        results = []
    
    return jsonify(results)

#Retreive all group performer ratings
@app.route('/api/group_performer_ratings/<group_id>')
def get_group_performer_ratings(group_id):    
    results = group_performer_ratings(group_id)
    if not results:
        results = []
    
    return jsonify(results)

#Retreive all of the given user's song ratings
@app.route('/api/user_song_ratings/<username>')
def get_user_song_ratings(username):            
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
    
   
    
    return jsonify({"user_song_ratings": ratings_data})

#Retreive all of the given user's album ratings
@app.route('/api/user_album_ratings/<username>')
def get_user_album_ratings(username):
    user_ratings = User_Album_Rating.query.filter_by(username=username).all()
    ratings_data = [{"album": album_id_to_album(rating.album_id).name,"album_id": rating.album_id, "rating": rating.rating, "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    return jsonify({"user_album_ratings": ratings_data})

#Retreive all of the given user's performer ratings
@app.route('/api/user_performer_ratings/<username>')
def get_user_performer_ratings(username):
    user_ratings = User_Performer_Rating.query.filter_by(username=username).all()    
    ratings_data = [{"performer": performer_id_to_performer(rating.performer_id).name,"performer_id": rating.performer_id, "rating": rating.rating, "rating_timestamp": rating.rating_timestamp} for rating in user_ratings]
    return jsonify({"user_performer_ratings": ratings_data})