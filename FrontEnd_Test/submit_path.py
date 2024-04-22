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
data = {"name": "submit3",
        "path": [{"latitude": 48.871291142044036, "longitude": 2.353239767253399}, 
                 {"latitude": 48.87129268574556, "longitude": 2.3530660942196846}, 
                 {"latitude": 48.871323339237506, "longitude": 2.3528746515512466}, 
                 {"latitude": 48.871371855517324, "longitude": 2.3526986315846443}, 
                 {"latitude": 48.87140250896076, "longitude": 2.35260508954525}, 
                 {"latitude": 48.87142015122184, "longitude": 2.352567538619041}, 
                 {"latitude": 48.871430295519176, "longitude": 2.35254306346178}, 
                 {"latitude": 48.871430295519176, "longitude": 2.3525340110063553}, 
                 {"latitude": 48.87143624977966, "longitude": 2.3525363579392433}, 
                 {"latitude": 48.87144198351133, "longitude": 2.3525363579392433}, 
                 {"latitude": 48.87144198351133, "longitude": 2.35254306346178}]}



backend_url = "https://factual-moved-snapper.ngrok-free.app/submit_path"

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

