from geopy.distance import great_circle
from itertools import permutations
import json
import redis
import networkx as nx
import numpy as np
import pandas as pd
import ast
import requests

#data
data = {'startPoint': {'latitude': 48.8562037972393, 'longitude': 2.2943239502355737}, 
        'destinations': [{'latitude': 48.85528602969244, 'longitude': 2.2946827087929194}, 
                         {'latitude': 48.85552560210157, 'longitude': 2.2953091975457367}, 
                         {'latitude': 48.856036451288105, 'longitude': 2.2955099952228224}]}


backend_url = "https://factual-moved-snapper.ngrok-free.app/traveling_salesman"

# Setting the Content-Type header to application/json
headers = {
    "Content-Type": "application/json"
}

# Sending the POST request
response = requests.post(backend_url, data = json.dumps(data), headers = headers)

# Checking the response
if response.status_code == 200:
    print("POST request was successful!")
    print("Response:", response.text)
else:
    print("POST request failed with status code:", response.status_code)

