import pymongo
import json
import os
from bson.json_util import dumps

# MongoDB connection details
MONGO_URI = "mongodb+srv://vidyut822:vidyut123@fitplan.w55py.mongodb.net/?retryWrites=true&w=majority&appName=FITPLAN"
DATABASE_NAME = "test"
COLLECTION_NAME = "users"
OUTPUT_FOLDER = "json_memory"
OUTPUT_FILE = os.path.join(OUTPUT_FOLDER, "user_profile.json")

# Ensure the output folder exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Connect to MongoDB
client = pymongo.MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# Function to retrieve user data as JSON
def get_user_data(query):
    """Retrieve user data based on a query and return as JSON."""
    try:
        # Find matching documents (example: find user by email)
        user_data = collection.find(query)

        # Convert BSON to JSON
        user_json = dumps(user_data, indent=4)
        return json.loads(user_json)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Function to save user data to a JSON file
def save_to_json_file(data, output_path):
    """Save JSON data to a file."""
    try:
        with open(output_path, "w") as json_file:
            json.dump(data, json_file, indent=4)
        print(f"User profile saved successfully to '{output_path}'.")
    except Exception as e:
        print(f"Failed to save user profile: {e}")

# Example query: Find user by email
query = {"email": "emily.parker@example.com"}
user_profile = get_user_data(query)

# Save the retrieved user data to user_profile.json
if user_profile:
    print("User Data (JSON):")
    print(json.dumps(user_profile, indent=4))
    save_to_json_file(user_profile, OUTPUT_FILE)
else:
    print("No user found matching the query.")
