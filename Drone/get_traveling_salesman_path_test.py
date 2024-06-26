import websocket
import requests
import json

#URL endpoint of backend server
backend_url = "https://factual-moved-snapper.ngrok-free.app/get_traveling_salesman_path"

#Get Next Point on Traveling Salesman Path From the Backend Server
# Sending the GET request
response = requests.get(backend_url)

# Checking the response
if response.status_code == 200:
    print("GET request was successful!")
    print("Response:", response.text)
    
    data = None
    try:
        data = response.json()
    except:
        pass
    
    if data != None:
        print("Data: ", data)
        print("Type of Data: ", type(data))
else:
    print("GET request failed with status code:", response.status_code)

