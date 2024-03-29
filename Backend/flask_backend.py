from flask import Flask, request, jsonify
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
    
#Delete Path from MongoDB
@app.route("/delete_path", methods=['POST'])
def delete_path():
    if request.method == 'POST':
        data = request.get_json()
        print("Data Received: ", data)
        
        path_name = data['name']
        
        ### REMOVE DATA FROM REDIS
        all_keys = r.keys('path:*')

        # Define the name you're searching for
        name_to_search = path_name

        # Iterate through keys and check if their corresponding values contain the desired name
        keys_with_desired_name = []
        for key in all_keys:
            value = r.get(key)            
            if value:
                # Assuming the stored value is JSON
                try:
                    value_dict = json.loads(value)
                    if 'name' in value_dict and value_dict['name'] == name_to_search:
                        keys_with_desired_name.append(key)
                except:
                    continue

        #Remove Keys, decrement path counter
        for key in keys_with_desired_name:
            idx = int(key[5:])
            r.decr("path_counter")
            r.delete(key)
            r.lrem('path_list', 0, idx)
        
        ### REMOVE DATA FROM MONGODB
        # Define the filter
        db = client["Saved_Data"]
        collection = db["Saved_Paths"]
        filter = {'name': name_to_search}
        result = collection.delete_many(filter)
        print(f"Deleted {result.deleted_count} documents.")


        return 'Successfully Submitted'

#Load Paths from MongoDB
@app.route("/load_paths", methods=['GET'])
def load_paths():
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    #Get MongoDB Collection
    db = client["Saved_Data"]
    collection = db["Saved_Paths"]

    # Fetch all documents from the collection
    documents = collection.find({}, {"_id": 0})

    # Convert the cursor to a list
    documents_list = list(documents)
    
    print("Documents List: ", documents_list)
    print(jsonify(documents_list))
    
    return jsonify(documents_list)

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
        
        data = request.get_json()
        print("Data Received: ", data) 
    
        # Get the current length of the list containing documents
        most_recent_path = r.get("path_counter")
        if most_recent_path is not None:
            most_recent_path = int(most_recent_path)
        else:
            r.set("path_counter", 0)
            most_recent_path = 0
        
        # Store Data in Redis
        key = r.incr("path_counter")
        path_data = json.dumps(data)
        r.set(f"path:{key}", path_data)
        r.rpush("path_list", key)
        
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

#Send GPS Data to Backend
@app.route("/send_gps_data", methods = ["POST"])
def send_gps_data():
    if request.method == 'POST':
        print("Post Request Received")
        print("Request: ", request.get_data())
        data = request.get_json()
        print("Data Received: ", data)
        return 'Successful'

#Run Flask Application
if __name__ == "__main__":
    app.run(port = 80, host = "0.0.0.0")