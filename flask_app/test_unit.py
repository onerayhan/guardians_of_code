import unittest
from flask import Flask
from app import app, db

class TestApp(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_view_logs(self):
        response = self.app.get('/logs')
        self.assertEqual(response.status_code, 200)
        

    def test_spoti_login(self):
        response = self.app.get('/spoti_login/test_user')
        self.assertEqual(response.status_code, 302)  # Assuming a successful redirect

    def test_callback(self):
        # Assuming a successful Spotify authentication
        # Make sure to replace the placeholders with valid data
        response = self.app.get('/callback?code=valid_code&state=valid_state')
        self.assertEqual(response.status_code, 200)
        

    def test_get_curr_user_tracks(self):
        # Assuming a valid user with access token
        response = self.app.get('/spoti/get_curr_user_tracks/test_user')
        self.assertEqual(response.status_code, 200)
        

    def test_get_user_top_tracks(self):
        # Assuming a valid user with access token
        response = self.app.get('/spoti/get_user_top_tracks/test_user')
        self.assertEqual(response.status_code, 200)
        

    def test_get_tracks_info(self):
        # Assuming a valid user with access token and track IDs
        response = self.app.get('/spoti/get_tracks_info/test_user/track_id1,track_id2')
        self.assertEqual(response.status_code, 200)
        

    def test_get_albums_info(self):
        # Assuming a valid user with access token and album IDs
        response = self.app.get('/spoti/get_albums_info/test_user/album_id1,album_id2')
        self.assertEqual(response.status_code, 200)
        
        
    def test_get_artists_info(self):
        # Assuming a valid user with access token and artist IDs
        response = self.app.get('/spoti/get_artists_info/test_user/artist_id1,artist_id2')
        self.assertEqual(response.status_code, 200)
        

    def test_get_artist_album(self):
        # Assuming a valid user with access token and artist IDs
        response = self.app.get('/spoti/get_artist_album/test_user/artist_id1,artist_id2')
        self.assertEqual(response.status_code, 200)
        

    def test_get_artist_top_track(self):
        # Assuming a valid user with access token and artist IDs
        response = self.app.get('/spoti/get_artist_top_track/test_user/artist_id1,artist_id2')
        self.assertEqual(response.status_code, 200)
        

    def test_get_recommendations(self):
        # Assuming a valid user with access token and valid JSON data
        
        data = {
            'seed_tracks': ['track_id1', 'track_id2'],
            'seed_artists': ['artist_id1', 'artist_id2'],
            'seed_albums': ['album_id1', 'album_id2'],
            'seed_genres': True  # or False based on your use case
        }
        response = self.app.post('/spoti/get_recommendations/test_user', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_spoti_search(self):
        # Assuming a valid user with access token and valid JSON data
        
        data = {
            'query': 'search_query',
            'type': 'track'  # or 'album', 'artist', etc. based on your use case
        }
        response = self.app.post('/spoti/search/test_user', json=data)
        self.assertEqual(response.status_code, 200)
        
        
    def test_check_spoti_connection(self):
        # Assuming a valid user with an existing connection
        response = self.app.get('/api/check_spoti_connection/test_user')
        self.assertEqual(response.status_code, 200)
        

    def test_add_mobile_token(self):
        # Assuming a valid user and valid JSON data
        
        data = {'token_data': {'token_key': 'token_value'}}
        response = self.app.post('/api/add_mobile_token/test_user', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_register(self):
        # Assuming valid JSON data for user registration
        
        data = {'username': 'test_user', 'password': 'password123', 'email': 'test@example.com', 'birthday': '2000-01-01'}
        response = self.app.post('/api/register', json=data)
        self.assertEqual(response.status_code, 201)
        
        
    def test_add_songs_batch(self):
        # Assuming valid JSON data for adding songs in batch
        
        data = {'username': 'test_user', 'songs': [{'song_name': 'Song1'}, {'song_name': 'Song2'}]}
        response = self.app.post('/api/add_songs_batch', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_add_rate_batch(self):
        # Assuming valid JSON data for adding ratings in batch
        
        data = {'username': 'test_user', 'ratings': [{'rating_type': 'song_rate', 'song_id': 1, 'rating': 5}, {'rating_type': 'album_rate', 'album_id': 1, 'rating': 4}]}
        response = self.app.post('/api/add_rate_batch', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_add_user_song_rating(self):
        # Assuming valid JSON data for adding a user song rating
        
        data = {'username': 'test_user', 'song_id': 1, 'rating': 5}
        response = self.app.post('/api/add_user_song_ratings', json=data)
        self.assertEqual(response.status_code, 201)
        

    def test_add_user_album_rating(self):
        # Assuming valid JSON data for adding a user album rating
        
        data = {'username': 'test_user', 'album_id': 1, 'rating': 4}
        response = self.app.post('/api/add_user_album_ratings', json=data)
        self.assertEqual(response.status_code, 201)
        

    def test_add_user_performer_rating(self):
        # Assuming valid JSON data for adding a user performer rating
        
        data = {'username': 'test_user', 'performer_id': 1, 'rating': 3}
        response = self.app.post('/api/add_user_performer_ratings', json=data)
        self.assertEqual(response.status_code, 201)
        
        
    def test_user_followings_genre_preference(self):
        # Assuming valid JSON data for getting user followings genre preference
        
        data = {'username': 'test_user'}
        response = self.app.post('/api/user_followings_genre_preference', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_user_followings_album_preference(self):
        # Assuming valid JSON data for getting user followings album preference
        
        data = {'username': 'test_user'}
        response = self.app.post('/api/user_followings_album_preference', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_user_followings_performer_preference(self):
        # Assuming valid JSON data for getting user followings performer preference
        
        data = {'username': 'test_user'}
        response = self.app.post('/api/user_followings_performer_preference', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_api_form_groups(self):
        # Assuming valid JSON data for forming groups
        
        data = {'user_arr': ['user1', 'user2'], 'group_name': 'TestGroup'}
        response = self.app.post('/api/form_groups', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_display_user_group(self):
        # Assuming valid username for displaying user group
        # Make sure to replace the placeholder with a real username
        username = 'test_user'
        response = self.app.get(f'/api/display_user_group/{username}')
        self.assertEqual(response.status_code, 200)
        

    def test_add_user_to_group(self):
        # Assuming valid JSON data for adding a user to a group
        
        data = {'username': 'test_user', 'group_id': 1}
        response = self.app.post('/api/add_user_to_group', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_remove_user_from_group(self):
        # Assuming valid JSON data for removing a user from a group
        
        data = {'username': 'test_user', 'group_id': 1}
        response = self.app.post('/api/remove_user_from_group', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_user_followings(self):
        # Assuming valid JSON data for getting user followings
        
        data = {'username': 'test_user'}
        response = self.app.post('/api/user_followings', json=data)
        self.assertEqual(response.status_code, 200)
        

    def test_follow_user(self):
        # Assuming valid JSON data for following a user
        
        data = {'follower_username': 'follower_user', 'followed_username': 'followed_user'}
        response = self.app.post('/api/follow', json=data)
        self.assertEqual(response.status_code, 201)
        

    def test_unfollow_user(self):
        # Assuming valid JSON data for unfollowing a user
        
        data = {'follower_username': 'follower_user', 'followed_username': 'followed_user'}
        response = self.app.post('/api/unfollow', json=data)
        self.assertEqual(response.status_code, 200)
        

if __name__ == '__main__':
    unittest.main()
