from flask import Flask
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)