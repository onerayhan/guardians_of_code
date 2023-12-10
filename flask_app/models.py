from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class users(db.Model):
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    birthday = db.Column(db.String(100), nullable=False)
    profile_picture = db.Column(db.LargeBinary, nullable=True)
    public_id = db.Column(db.String(32), primary_key=True, nullable=False)
    
    def add_to_group(self, group):
        
        if group:
            association = GroupUser(username=self.username, group_id=group.group_id)
            db.session.add(association)
            db.session.commit()
    
    def remove_from_group(self, group):
        
        if group:
            association = GroupUser.query.filter_by(username=self.username, group_id=group.group_id).first()
            db.session.delete(association)
            db.session.commit()
         
class FollowSystem(db.Model):
    follower_username = db.Column(db.String(100), nullable=False, primary_key=True)
    followed_username = db.Column(db.String(100), nullable=False, primary_key=True)
    __table_args__ = (
        db.ForeignKeyConstraint(['follower_username'], ['users.username'], ondelete='CASCADE'),
        db.ForeignKeyConstraint(['followed_username'], ['users.username'], ondelete='CASCADE')
    )
        
class Group(db.Model):
    group_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    group_name = db.Column(db.String(100), nullable=False)     
    
    
class GroupUser(db.Model):
    username = db.Column(db.String(100), db.ForeignKey('users.username', ondelete='CASCADE'), primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('group.group_id', ondelete='CASCADE'), primary_key=True)
    

#class DeviceToken(db.Model):
#   device_token = db.Column(db.String(255), primary_key=True, nullable=False)
#   public_id = db.Column(db.String(32), nullable=False)
#   __table_args__ = (
#        db.ForeignKeyConstraint(['public_id'], ['users.public_id'])        
#    )
