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
path_name = 'save3'
data = {'name': path_name}


backend_url = "https://factual-moved-snapper.ngrok-free.app/delete_path"

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

