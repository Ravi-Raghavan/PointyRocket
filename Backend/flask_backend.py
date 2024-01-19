from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origin = 'http://localhost:8000')

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

#Receive Data from Front End
@app.route("/submit_path", methods=['POST'])
def submit_path():
    if request.method == 'POST':
        data = request.get_json()
        print("Data Received: ", data)        
        return 'Data Successfully Submitted'

#Run Flask Application
if __name__ == "__main__":
    app.run(port = 8000, host = "0.0.0.0")
