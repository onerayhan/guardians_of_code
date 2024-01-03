from flask import Flask, render_template
from flask_cors import CORS
from config import Config
import time
from flask_sqlalchemy import SQLAlchemy

#Config.py hidden due to security reasons (same with ip4 address for ec2 instance)

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
db = SQLAlchemy()
db.init_app(app)

# To avoid db initilization conflict
time.sleep(1)

from models import *
from song_models import *
from utils import *
from endpoints import *

# For ML initilization
time.sleep(1)
from ml_recommendation import recommendation_parameters_to_weights, return_recommended_songs

@app.route('/logs', methods=['GET'])
def view_logs():
    with open('/var/log/gunicorn/log.txt', 'r') as log_file:
        logs = log_file.readlines()

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return '\n'.join(logs)

    return render_template('logs.html', logs=logs)

@app.route('/clear_logs', methods=['POST'])
def clear_logs():
    with open('/var/log/gunicorn/log.txt', 'w') as log_file:
        log_file.write('')  # Clear the contents of the log file

    return jsonify(success=True)

@app.route('/api/recommendations/<username>', methods=['POST'])
def recommendations(username):
    data = request.get_json()
    target_audience = data.get('target_audience')
    criteria_list = data.get('criteria_list')    
    
    if target_audience != 'all' and target_audience != 'followings' and target_audience != 'group':
        return jsonify({'error': 'target_audience can only be all/followings/group !'}), 400
    
    if len(criteria_list) < 1:
        return jsonify({'error': 'At least one criteria must be given, dont just give an empty list'})
    
    for criteria in criteria_list:
        if criteria != 'genre' and criteria != 'album' and criteria != 'performer':
            return jsonify({'error': 'Criteria can only be genre/album/performer'})
        
    weights_list = recommendation_parameters_to_weights(username, target_audience, criteria_list)    
    recommended_songs = return_recommended_songs(username, weights_list, target_audience)  
    
    return jsonify(recommended_songs)     
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)