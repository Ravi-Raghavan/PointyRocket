#### This file is used to test the feature to dump redis data to mongodb
from pymongo import MongoClient

#MongoDB Information
uri = "mongodb+srv://raviraghavan:gnGgV5YnXLFrYXJ7@capstone.fj6fsut.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#Get MongoDB Collection
db = client["Saved_Data"]
collection = db["Saved_Paths"]

# Fetch all documents from the collection
documents = collection.find({})

# Convert the cursor to a list
documents_list = list(documents)