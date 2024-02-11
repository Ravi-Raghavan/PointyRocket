from geopy.distance import great_circle
from itertools import permutations
import json

import networkx as nx
import numpy as np
import pandas as pd

data = {'startPoint': {'latitude': 48.8562037972393, 'longitude': 2.2943239502355737}, 
        'destinations': [{'latitude': 48.85528602969244, 'longitude': 2.2946827087929194}, 
                         {'latitude': 48.85552560210157, 'longitude': 2.2953091975457367}, 
                         {'latitude': 48.856036451288105, 'longitude': 2.2955099952228224}]}

#Initialize dictionary with nodes
nodes = {}
nodes['startPoint'] = (data['startPoint']['latitude'], data['startPoint']['longitude'])

for index, destination in enumerate(data['destinations']):
        nodes[f'destination_{index}'] = (destination['latitude'], destination['longitude'])

# Specify the starting point
starting_node = 'startPoint'

# Create a complete graph where each node is connected to every other node
G = nx.Graph()
for point in nodes:
    G.add_node(point, pos=nodes[point])

# Connect nodes based on great circle distance
for node1, node2 in permutations(G.nodes(), 2):
    pos1 = G.nodes[node1]['pos']
    pos2 = G.nodes[node2]['pos']
    distance = great_circle(pos1, pos2).kilometers
    G.add_edge(node1, node2, weight=distance)

# Find the shortest path starting from the specified starting point
shortest_path = list(nx.approximation.traveling_salesman_problem(G, cycle=True))

# Reorder the path to start from the specified starting point
index = shortest_path.index(starting_node)
shortest_path = shortest_path[index:] + shortest_path[:index]

print("Shortest path starting from", starting_node + ":", shortest_path)
