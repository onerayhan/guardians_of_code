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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)