#Interfile imports 
from app import app, db
from utils import username_to_user, username_to_groups, form_group, group_id_to_group, get_group_members

#Library imports
from flask import request, jsonify

# Forming groups by giving group names and an user array with the condition one person can not form a group by itself
@app.route('/api/form_groups', methods=['POST'])
def api_form_groups():
    data = request.get_json()
    user_arr = data.get('username_arr')
    group_name = data.get('group_name')   
    
    if len(user_arr) < 2:
        return "There must be at least 2 people to form a group.", 400
    
    if not group_name:
        return "Group name has to be specified.", 400    
    
    form_group(group_name, user_arr)
    return jsonify({'message': f'{group_name} with {len(user_arr)} users has been formed.'}), 200

# Displaying user's group
@app.route('/api/display_user_group/<username>')
def display_user_group(username):        
    return jsonify(username_to_groups(username)), 200 

# Adding a user to the group
@app.route('/api/add_user_to_group', methods=['POST'])
def add_user_to_group():
    data = request.get_json()
    username = data.get('username')
    group_id = data.get('group_id')
    if not group_id or not username:
        return "Group id and username have to be specified.", 400
    
    user = username_to_user(username)
    group = group_id_to_group(group_id)    
    
    user.add_to_group(group)
    return jsonify({'message': f'{username} has been successfully added to the group `{group.group_name}.'})
 
# Removing a user from the group   
@app.route('/api/remove_user_from_group', methods=['POST'])
def remove_user_from_group():
    data = request.get_json()
    username = data.get('username')
    group_id = data.get('group_id')
    if not group_id or not username:
        return "Group id and username have to be specified.", 400
    
    user = username_to_user(username)
    group = group_id_to_group(group_id)
    
    user.remove_from_group(group)   
    
    if len(get_group_members(group_id)) < 2:
        group = group_id_to_group(group)
        db.session.delete(group)
     
    return jsonify({'message': f'{username} has been successfully removed from the {group.group_name}.'})