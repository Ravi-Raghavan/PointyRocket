import websocket
import requests
import json

#URL endpoint of backend server
backend_url = "https://factual-moved-snapper.ngrok-free.app/get_path"

#Get Drone Orientation Data From the Backend Server
# Sending the GET request
response = requests.get(backend_url)

# Checking the response
if response.status_code == 200:
    print("GET request was successful!")
    print("Response:", response.text)
    
    data = response.json()
    print("Data: ", data)
    print("Type of Data: ", type(data))
else:
    print("GET request failed with status code:", response.status_code)

