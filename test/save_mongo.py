#### This file is used to test the feature to dump redis data to mongodb

from pymongo import MongoClient
import json
import redis

uri = "mongodb+srv://raviraghavan:gnGgV5YnXLFrYXJ7@capstone.fj6fsut.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, ssl=True)

#Redis Data Store Information
r = redis.Redis(
    host='redis-18159.c274.us-east-1-3.ec2.cloud.redislabs.com',
    port=18159,
    password='JAmKJ1sxcZgGmZmkWg6RnJInQZlwL9Nf')

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
# Get the current length of the list containing documents
most_recent_path = r.get("path_counter")
if most_recent_path is not None:
    most_recent_path = int(most_recent_path)
else:
    most_recent_path = 0

print("Most Recent Path Index:", most_recent_path)

#Fetch Path Data of Most Recent Path
path_data = r.lrange(f"path:{most_recent_path}", 0, -1)[0]
path_data = json.loads(path_data)

#Get MongoDB Collection
db = client["Saved_Data"]
collection = db["Saved_Paths"]

#Store Data to MongoDB
result = collection.insert_one(path_data)
print(f"Inserted Recent Path with ID: {result.inserted_id}")
