from flask import Flask, request
from flask_cors import CORS
import json
import redis
from pymongo import MongoClient

#Flask Server Information
app = Flask(__name__)
CORS(app, origin = 'http://localhost:8000', resources={r"/*": {"origins": "*"}})

#MongoDB Information
uri = "mongodb+srv://raviraghavan:gnGgV5YnXLFrYXJ7@capstone.fj6fsut.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri)

#Redis Data Store Information
r = redis.Redis(
    host='redis-18159.c274.us-east-1-3.ec2.cloud.redislabs.com',
    port=18159,
    password='JAmKJ1sxcZgGmZmkWg6RnJInQZlwL9Nf')
    
#Set up Default Home Page
@app.route("/")
def hello_world():
    return "<p>Backend Flask Server</p>"

#Solve Traveling Salesman Problem 
@app.route("/traveling_salesman", methods = ["POST"])
def traveling_salesman():
    if request.method == "POST":
        data = request.get_json()
        print("Data Received: ", data)
        
        print(type(data))
        
        return "Successfully Submitted"

#Receive Data from Front End
@app.route("/submit_path", methods=['POST'])
def submit_path():
    if request.method == 'POST':
        data = request.get_json()
        print("Data Received: ", data) 
        
        # Get the current length of the list containing documents
        most_recent_path = r.get("path_counter")
        if most_recent_path is not None:
            most_recent_path = int(most_recent_path)
        else:
            r.set("path_counter", "0")
            most_recent_path = 0
        
        # Store Data in Redis
        key = r.incr("path_counter")
        path_data = json.dumps(data)
        r.set(f"path:{key}", path_data)
        r.rpush("path_list", key)
        
        return 'Data Successfully Submitted'

# Save button to tell application to save Redis Data to MongoDB
@app.route("/save_data", methods = ["POST"])
def save_data():
    if request.method == 'POST':
        # Send a ping to confirm a successful connection
        try:
            client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
    
        # Get the current length of the list containing documents
        most_recent_path = r.get("path_counter")
        if most_recent_path is not None:
            most_recent_path = int(most_recent_path)
        else:
            r.set("path_counter", 0)
            most_recent_path = 0

        print("Most Recent Path Index:", most_recent_path)

        #Fetch Path Data of Most Recent Path
        path_data = r.get(f"path:{most_recent_path}")
        path_data = json.loads(path_data)

        #Get MongoDB Collection
        db = client["Saved_Data"]
        collection = db["Saved_Paths"]

        #Store Data to MongoDB
        result = collection.insert_one(path_data)
        print(f"Inserted Recent Path with ID: {result.inserted_id}")
        
        return 'Data Saved to MongoDB'
        

#Run Flask Application
if __name__ == "__main__":
    app.run(port = 80, host = "0.0.0.0")