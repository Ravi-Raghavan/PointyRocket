from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import redis
from pymongo import MongoClient
from geopy.distance import great_circle
from itertools import permutations
import networkx as nx
import ast
import numpy as np

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

#Given an angle in radians, make sure it is from -pi to pi
def scale_angle(theta):
    return theta - (2 * np.pi * (np.floor((theta + np.pi) / (2 * np.pi))))
    
#Set up Default Home Page
@app.route("/")
def hello_world():
    return "<p>Backend Flask Server</p>"

#Store traveling salesman path in Redis
def store_traveling_salesman_path(path):
    queue_name = 'traveling_salesman_queue'
    path = json.dumps(path)
    
    # Check if the queue exists
    if not r.exists(queue_name):
        # Create the queue
        r.rpush(queue_name, path)
        print(f"Queue '{queue_name}' created and items pushed: {path}")
    else:
        # Push items to the existing queue
        r.rpush(queue_name, path)
        print(f"Items pushed to queue '{queue_name}': {path}")

#Load traveling salesman path from Redis
def load_traveling_salesman_path():
    queue_name = 'traveling_salesman_queue'
    front_item = r.lindex(queue_name, 0)
    front_item = json.loads(front_item)
    return front_item

#Send Drone Orientation to Backend
@app.route("/set_drone_orientation", methods = ["POST"])
def set_drone_orientation():
    if request.method == "POST":
        drone_orientation_data = request.get_json()
        r.hset('drone_orientation', 'longitude', drone_orientation_data['longitude'])
        r.hset('drone_orientation', 'latitude', drone_orientation_data['latitude'])
        r.hset('drone_orientation', 'orientation_angle', drone_orientation_data['orientation_angle'])
        return "SUCCESSFULLY UPDATED DRONE ORIENTATION"

#Get Drone Orientation From Backend
@app.route("/get_drone_orientation", methods = ["GET"])
def get_drone_orientation():
    if request.method == "GET":
        longitude = float(r.hget('drone_orientation', 'longitude').decode('utf-8'))
        latitude = float(r.hget('drone_orientation', 'latitude').decode('utf-8'))
        orientation_angle = float(r.hget('drone_orientation', 'orientation_angle').decode('utf-8'))
        
        drone_orientation = {
            "longitude": longitude,
            "latitude": latitude,
            "orientation_angle": orientation_angle
        }
        
        return json.dumps(drone_orientation)

#Get Traveling Salesman Path
@app.route("/get_traveling_salesman_path", methods = ["GET"])
def get_traveling_salesman_path():
    if request.method == "GET":
        traveling_salesman_path = load_traveling_salesman_path()
        
        if (len(traveling_salesman_path) < 2):
            r.lpop('traveling_salesman_queue')
            return "YOU HAVE ALREADY FINSHED YOUR PATH"
                        
        #Current Drone Orientation
        longitude = float(r.hget('drone_orientation', 'longitude').decode('utf-8'))
        latitude = float(r.hget('drone_orientation', 'latitude').decode('utf-8'))
        orientation_angle = float(r.hget('drone_orientation', 'orientation_angle').decode('utf-8'))
        
        #Next Drone Orientation
        next_point = traveling_salesman_path[1]
        
        dx = next_point[0] - longitude
        dy = next_point[1] - latitude
        angle_rad = np.arctan2(dy, dx)
        dTheta = scale_angle(orientation_angle - angle_rad)
        
        print(f"dx: {dx}, dy: {dy}, dz: {dTheta}")
        
        #Remove the "current point" from traveling salesman path
        traveling_salesman_path = traveling_salesman_path[1: ]
                
        #Update Traveling Salesman Queue
        queue_name = 'traveling_salesman_queue'
        r.lset(queue_name, 0, json.dumps(traveling_salesman_path))
        
        #Return Updated Traveling Salesman Path
        return traveling_salesman_path

#Solve Traveling Salesman Problem 
@app.route("/traveling_salesman", methods = ["POST"])
def traveling_salesman():
    if request.method == "POST":
        data = request.get_json()
        
        #Initialize dictionary with Starting Point
        nodes = {}
        nodes['startPoint'] = (data['startPoint']['latitude'], data['startPoint']['longitude'])    
        
        #Add destination points to graph
        for index, destination in enumerate(data['destinations']):
            nodes[f'destination_{index}'] = (destination['latitude'], destination['longitude'])   
            
        # Specify the starting point
        starting_node = 'startPoint'
        
        # Create a complete graph where each node is connected to every other node
        G = nx.Graph()
        for point in nodes:
            G.add_node(point, pos = nodes[point])

        # Connect nodes based on great circle distance
        for node1, node2 in permutations(G.nodes(), 2):
            pos1 = G.nodes[node1]['pos']
            pos2 = G.nodes[node2]['pos']
            distance = great_circle(pos1, pos2).kilometers
            G.add_edge(node1, node2, weight = distance)

        # Find the shortest path starting from the specified starting point
        shortest_path = list(nx.approximation.traveling_salesman_problem(G, cycle=True))
        
        # Reorder the path to start from the specified starting point and get the corresponding longitude/latitude coordinates
        index = shortest_path.index(starting_node)
        shortest_path = shortest_path[index:] + shortest_path[:index]
        coordinates =  [nodes[point] for point in shortest_path]
        
        #Store Traveling Salesman Path in Redis
        store_traveling_salesman_path(coordinates)
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