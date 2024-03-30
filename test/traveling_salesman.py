from geopy.distance import great_circle
from itertools import permutations
import json
import redis
import networkx as nx
import numpy as np
import pandas as pd
import ast

#Redis Data Store Information
r = redis.Redis(
    host='redis-18159.c274.us-east-1-3.ec2.cloud.redislabs.com',
    port=18159,
    password='JAmKJ1sxcZgGmZmkWg6RnJInQZlwL9Nf')

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
    front_item = r.lindex(queue_name, 0).decode('utf-8')
    front_item = ast.literal_eval(front_item)
    front_item = json.loads(front_item)
    return front_item

#data
data = {'startPoint': {'latitude': 48.8562037972393, 'longitude': 2.2943239502355737}, 
        'destinations': [{'latitude': 48.85528602969244, 'longitude': 2.2946827087929194}, 
                         {'latitude': 48.85552560210157, 'longitude': 2.2953091975457367}, 
                         {'latitude': 48.856036451288105, 'longitude': 2.2955099952228224}]}

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

# Reorder the path to start from the specified starting point
index = shortest_path.index(starting_node)
shortest_path = shortest_path[index:] + shortest_path[:index]
coordinates =  [nodes[point] for point in shortest_path]

print("Shortest path starting from", starting_node + ":", shortest_path)
print("Shortest Path starting from", str(coordinates[0]) + ":", coordinates)

store_traveling_salesman_path(json.dumps(coordinates))
loaded_path = load_traveling_salesman_path()

for coord in loaded_path:
    print("Longitude: ", coord[0], " Latitude: ", coord[1])