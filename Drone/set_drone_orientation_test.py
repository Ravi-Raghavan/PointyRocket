import websocket
import requests
import json

#URL endpoint of backend server
backend_url = "https://factual-moved-snapper.ngrok-free.app/set_drone_orientation"

#Drone Orientation
drone_orientation = {
    "longitude": 37.7749,
    "latitude": -122.4194,
    "orientation_angle": 20
}

#Send Drone Orientation Data to the Backend Server

# Setting the Content-Type header to application/json
headers = {
    "Content-Type": "application/json"
}

# Sending the POST request
response = requests.post(backend_url, data = json.dumps(drone_orientation), headers = headers)

# Checking the response
if response.status_code == 200:
    print("POST request was successful!")
    print("Response:", response.text)
else:
    print("POST request failed with status code:", response.status_code)

