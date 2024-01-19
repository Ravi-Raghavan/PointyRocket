from flask import Flask, request
from flask_cors import CORS
import json
import redis

#Flask Server Information
app = Flask(__name__)
CORS(app, origin = 'http://localhost:8000')

#Redis Data Store Information
r = redis.Redis(
    host='redis-10297.c326.us-east-1-3.ec2.cloud.redislabs.com',
    port=10297,
    password='BkfdYjsO0yEZcJ6CZqFdavPAk1Xg9Esa')

# Get the current length of the list containing documents
starting_index = r.get("path_counter")
if starting_index is not None:
    starting_index = int(starting_index)
else:
    starting_index = 0

#Receive Data from Front End
@app.route("/submit_path", methods=['POST'])
def submit_path():
    if request.method == 'POST':
        data = request.get_json()
        print("Data Received: ", data) 
        
        # Store Data in Redis
        key = r.incr("path_counter")
        path_data = json.dumps(data)
        r.rpush(f"path:{key}", path_data)
        r.rpush("path_list", key)
        
        return 'Data Successfully Submitted'

#Run Flask Application
if __name__ == "__main__":
    app.run(port = 8000, host = "0.0.0.0")
