class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:admin@127.0.0.1/cs308_backend_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '5p#r7GZ9!J^T8&d@E*2$yS'
    SPOTIFY_CLIENT_ID = '730594d4821d437a99188f45ec40fcc8'
    SPOTIFY_CLIENT_SECRET = '5a319a9a17b84976ba497743b7f10a42'
    SPOTIFY_REDIRECT_URI = 'http://13.51.167.155/callback'