#Import Necessary Libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.distance import great_circle
from itertools import permutations
import json
import networkx as nx
import numpy as np
from pymongo import MongoClient
import redis

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

#### Traveling Salesman Code ####
#Helper Function to Store Traveling Salesman Path in Redis
def store_traveling_salesman_path(path):
    queue_name = 'traveling_salesman_queue'
    path = json.dumps(path)
    r.rpush(queue_name, path)

#Solve Traveling Salesman Problem and Store Path in Redis
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

#Given an angle in radians, make sure it is from -pi to pi
def scale_angle(theta):
    return theta - (2 * np.pi * (np.floor((theta + np.pi) / (2 * np.pi))))

#Load traveling salesman path from Redis
def load_traveling_salesman_path():
    queue_name = 'traveling_salesman_queue'
    front_item = r.lindex(queue_name, 0)
    front_item = json.loads(front_item)
    return front_item

#Get Traveling Salesman Path
@app.route("/get_traveling_salesman_path", methods = ["GET"])
def get_traveling_salesman_path():
    if request.method == "GET":
        traveling_salesman_path = load_traveling_salesman_path()

        #Current Drone Orientation
        longitude = float(r.hget('drone_orientation', 'longitude').decode('utf-8'))
        latitude = float(r.hget('drone_orientation', 'latitude').decode('utf-8'))
        orientation_angle = float(r.hget('drone_orientation', 'orientation_angle').decode('utf-8'))
                        
        #Directions
        directions = []
        
        #Go through all coordinates in path and calculate directions
        current_longitude = longitude
        current_latitude = latitude
        current_orientation_angle = orientation_angle
        for coordinate in traveling_salesman_path:
            dx = coordinate[0] - current_longitude
            dy = coordinate[1] - current_latitude
            orientation_angle = np.arctan2(dy, dx)
            dTheta = scale_angle(orientation_angle - current_orientation_angle)   
            
            if dTheta > 0:
                directions.append(2)
            elif dTheta < 0:
                directions.append(1)
            
            directions.append(0)
            
            #Update Drone Orientation
            r.hset('drone_orientation', 'longitude', coordinate[0])
            r.hset('drone_orientation', 'latitude', coordinate[1])
            r.hset('drone_orientation', 'orientation_angle', orientation_angle)
            current_longitude = coordinate[0]
            current_latitude = coordinate[1]
            current_orientation_angle = orientation_angle
        
        directions.append(4) 
        
        r.lpop('traveling_salesman_queue')
        #Return GPS Coordinate of Next Point on Path
        return json.dumps({"commands": directions})
#################################

#### Drone Orientation Data ####
#Store Magnetometer Data in Redis
@app.route("/store_magnetometer_data", methods = ["POST"])
def store_magnetometer_data():
    if request.method == 'POST':
        magnetometer_data = request.get_json()
        r.hset('drone_orientation', 'field_strength_x', magnetometer_data['field_strength_x'])
        r.hset('drone_orientation', 'field_strength_y', magnetometer_data['field_strength_y'])
        r.hset('drone_orientation', 'field_strength_z', magnetometer_data['field_strength_z'])
        return "SUCCESSFULLY UPDATED DRONE DATA"
    
#Load Magnetometer Data in Redis
@app.route("/load_magnetometer_data", methods = ["GET"])
def load_magnetometer_data():
    if request.method == 'GET':
        field_strength_x = float(r.hget('drone_orientation', 'field_strength_x').decode('utf-8'))
        field_strength_y = float(r.hget('drone_orientation', 'field_strength_y').decode('utf-8'))
        field_strength_z = float(r.hget('drone_orientation', 'field_strength_z').decode('utf-8'))
        
        drone_orientation = {
            "field_strength_x": field_strength_x,
            "field_strength_y": field_strength_y,
            "field_strength_z": field_strength_z
        }
        
        return json.dumps(drone_orientation)

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
################################# 

##### INDIVIDUAL PATH DATA #######
#Given a path name, delete it from MongoDB
@app.route("/delete_path", methods=['POST'])
def delete_path():
    if request.method == 'POST':
        data = request.get_json()        
        path_name = data['name']
        
        ### REMOVE DATA FROM MONGODB
        # Define the filter
        db = client["Saved_Data"]
        collection = db["Saved_Paths"]
        filter = {'name': path_name}
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
        
    #Return JSON version of documents list
    return jsonify(documents_list)

#Receive Data from Front End and Store in REDIS
@app.route("/submit_path", methods=['POST'])
def submit_path():
    if request.method == 'POST':
        #Get Data
        data = request.get_json()     
           
        # Store Data in Redis
        path_data = json.dumps(data)
        r.set(f"path", path_data)
        
        return 'Data Successfully Submitted'

# Save button to tell application to save data to MongoDB
@app.route("/save_path", methods = ["POST"])
def save_data():
    if request.method == 'POST':
        # Send a ping to confirm a successful connection
        try:
            client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)
        
        #Get Data
        data = request.get_json() 
        path_data = data           
        
        #Get MongoDB Collection
        db = client["Saved_Data"]
        collection = db["Saved_Paths"]

        #Store Data to MongoDB
        result = collection.insert_one(path_data)
        print(f"Inserted Recent Path with ID: {result.inserted_id}")
        
        return 'Data Saved to MongoDB'

#Load Path Data from Redis
def load_path():
    value = r.get('path')
    return json.loads(value)

#Get Path Data from Redis
@app.route("/get_path", methods = ["GET"])
def get_path():
    if request.method == "GET":
        try:
            path = load_path()['path']
        except:
            return json.dumps({"commands": [4]})
        
        #Current Drone Orientation
        longitude = float(r.hget('drone_orientation', 'longitude').decode('utf-8'))
        latitude = float(r.hget('drone_orientation', 'latitude').decode('utf-8'))
        orientation_angle = float(r.hget('drone_orientation', 'orientation_angle').decode('utf-8'))
                        
        #Directions
        directions = []
        directions.append(4)
        directions.append(3)
        
        #Go through all coordinates in path and calculate directions
        current_longitude = longitude
        current_latitude = latitude
        current_orientation_angle = orientation_angle
        for coordinate in path:
            dx = coordinate['longitude'] - current_longitude
            dy = coordinate['latitude'] - current_latitude
            orientation_angle = np.arctan2(dy, dx)
            dTheta = scale_angle(orientation_angle - current_orientation_angle)   
            
            if dTheta > 0:
                directions.append(2)
            elif dTheta < 0:
                directions.append(1)
            directions.append(3)
            
            directions.append(0)
            directions.append(3)
            
            #Update Drone Orientation
            r.hset('drone_orientation', 'longitude', coordinate['longitude'])
            r.hset('drone_orientation', 'latitude', coordinate['latitude'])
            r.hset('drone_orientation', 'orientation_angle', orientation_angle)
            current_longitude = coordinate['longitude']
            current_latitude = coordinate['latitude']
            current_orientation_angle = orientation_angle
        
        directions.append(4)
        
        r.delete('path')             
        #Return GPS Coordinate of Next Point on Path
        return json.dumps({"commands": directions})
################################# 

#Run Flask Application
if __name__ == "__main__":
    app.run(port = 80, host = "0.0.0.0")