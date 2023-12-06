from models import db

class Album(db.Model):
    album_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    release_year = db.Column(db.Integer)

class Performer(db.Model):
    performer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    
class Genre(db.Model):
    genre_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

class Mood(db.Model):
    mood_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

class Instrument(db.Model):
    instrument_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)

class Song_Album(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('album.album_id', ondelete='CASCADE'), primary_key=True)

class Song_Performer(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    performer_id = db.Column(db.Integer, db.ForeignKey('performer.performer_id', ondelete='CASCADE'), primary_key=True)

class Song_Genre(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.genre_id', ondelete='CASCADE'), primary_key=True)

class Song_Mood(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    mood_id = db.Column(db.Integer, db.ForeignKey('mood.mood_id', ondelete='CASCADE'), primary_key=True)

class Song_Instrument(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    instrument_id = db.Column(db.Integer, db.ForeignKey('instrument.instrument_id', ondelete='CASCADE'), primary_key=True)

class Song(db.Model):
    song_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    song_name = db.Column(db.String(255), nullable=False)
    length = db.Column(db.Time)
    tempo = db.Column(db.Integer)
    recording_type = db.Column(db.Enum('LIVE', 'STUDIO', 'RADIO'))
    listens = db.Column(db.Integer, default=0)
    release_year = db.Column(db.Integer)
    added_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    username = db.Column(db.String(100), db.ForeignKey('users.username', ondelete='CASCADE'), nullable=False)
    
    def add_album(self, album):
        
        if album:
            association = Song_Performer(song_id=self.song_id, album_id=album.album_id)
            db.session.add(association)
            db.session.commit()
    
    def add_performer(self, performer):
        
        if performer:             
            association = Song_Performer(song_id=self.song_id, performer_id=performer.performer_id)
            db.session.add(association)
            db.session.commit()
    
    def add_genre(self,genre):
        
        if genre:
            association = Song_Genre(song_id=self.song_id, genre_id=genre.genre_id)
            db.session.add(association)
            db.session.commit()
        
    def add_mood(self, mood):
        
        if mood:
            association = Song_Mood(song_id=self.song_id, mood_id=mood.mood_id)
            db.session.add(association)
            db.session.commit()
        
    def add_instrument(self, instrument):
        
        if instrument:
            association = Song_Instrument(song_id=self.song_id, instrument_id=instrument.instrument_id)
            db.session.add(association)
            db.session.commit()
    
class User_Song_Rating(db.Model):
    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), db.ForeignKey('users.username', ondelete='CASCADE'), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    rating_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    
class User_Album_Rating(db.Model):
    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), db.ForeignKey('users.username', ondelete='CASCADE'), nullable=False)
    album_id = db.Column(db.Integer, db.ForeignKey('album.album_id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    rating_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    
class User_Performer_Rating(db.Model):
    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), db.ForeignKey('users.username', ondelete='CASCADE'), nullable=False)
    performer_id = db.Column(db.Integer, db.ForeignKey('performer.performer_id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    rating_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())

class External_Service(db.Model):
    service_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(255), nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), db.ForeignKey('users.username', ondelete='CASCADE'), nullable=False)

class Imported_Song(db.Model):
    import_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'))
    service_id = db.Column(db.Integer, db.ForeignKey('external_service.service_id', ondelete='CASCADE'))
    external_song_id = db.Column(db.String(255))
    import_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())
