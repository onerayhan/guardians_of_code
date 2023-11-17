from models import db

class Performer(db.Model):
    performer_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

class Song(db.Model):
    song_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    length = db.Column(db.Time)
    tempo = db.Column(db.Integer)
    recording_type = db.Column(db.Enum('LIVE', 'STUDIO', 'RADIO'))
    listens = db.Column(db.Integer, default=0)
    release_year = db.Column(db.DateTime)
    added_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())

class Album(db.Model):
    album_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    release_year = db.Column(db.DateTime)

class UserRating(db.Model):
    rating_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'))
    album_id = db.Column(db.Integer, db.ForeignKey('album.album_id', ondelete='CASCADE'))
    performer_id = db.Column(db.Integer, db.ForeignKey('performer.performer_id', ondelete='CASCADE'))
    rating = db.Column(db.Integer, nullable=False)
    rating_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())

class Genre(db.Model):
    genre_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

class Mood(db.Model):
    mood_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)

class Instrument(db.Model):
    instrument_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)

class SongPerformer(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    performer_id = db.Column(db.Integer, db.ForeignKey('performer.performer_id', ondelete='CASCADE'), primary_key=True)

class SongAlbum(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    album_id = db.Column(db.Integer, db.ForeignKey('album.album_id', ondelete='CASCADE'), primary_key=True)

class SongGenre(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    genre_id = db.Column(db.Integer, db.ForeignKey('genre.genre_id', ondelete='CASCADE'), primary_key=True)

class SongMood(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    mood_id = db.Column(db.Integer, db.ForeignKey('mood.mood_id', ondelete='CASCADE'), primary_key=True)

class SongInstrument(db.Model):
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'), primary_key=True)
    instrument_id = db.Column(db.Integer, db.ForeignKey('instrument.instrument_id', ondelete='CASCADE'), primary_key=True)

class ExternalService(db.Model):
    service_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    service_name = db.Column(db.String(255), nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), db.ForeignKey('users.username'))

class ImportedSong(db.Model):
    import_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.song_id', ondelete='CASCADE'))
    service_id = db.Column(db.Integer, db.ForeignKey('external_service.service_id', ondelete='CASCADE'))
    external_song_id = db.Column(db.String(255))
    import_timestamp = db.Column(db.DateTime, server_default=db.func.current_timestamp())
