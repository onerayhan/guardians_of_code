from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class users(db.Model):
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    birthday = db.Column(db.String(100), nullable=False)
    profile_picture = db.Column(db.LargeBinary, nullable=True)
    public_id = db.Column(db.String(32), primary_key=True, nullable=False)
    
class FollowSystem(db.Model):
    follower_username = db.Column(db.String(100), nullable=False, primary_key=True)
    followed_username = db.Column(db.String(100), nullable=False, primary_key=True)
    __table_args__ = (
        db.ForeignKeyConstraint(['follower_username'], ['users.username']),
        db.ForeignKeyConstraint(['followed_username'], ['users.username'])
    )

#class DeviceToken(db.Model):
#   device_token = db.Column(db.String(255), primary_key=True, nullable=False)
#   public_id = db.Column(db.String(32), nullable=False)
#   __table_args__ = (
#        db.ForeignKeyConstraint(['public_id'], ['users.public_id'])        
#    )