import websocket
import requests
import json

#URL endpoint of backend server
backend_url = "https://factual-moved-snapper.ngrok-free.app/send_gps_data"

#GPS Data
gps_data = {
    "latitude": 37.7749,
    "longitude": -122.4194,
    "altitude": 10,
    "speed": 25,
    "timestamp": "2024-03-29T12:00:00Z",
    "satellites": 8,
    "accuracy": 5
}

#Send GPS Data to the Backend Server

# Setting the Content-Type header to application/json
headers = {
    "Content-Type": "application/json"
}

# Sending the POST request
response = requests.post(backend_url, data = json.dumps(gps_data), headers = headers)

# Checking the response
if response.status_code == 200:
    print("POST request was successful!")
    print("Response:", response.text)
else:
    print("POST request failed with status code:", response.status_code)
