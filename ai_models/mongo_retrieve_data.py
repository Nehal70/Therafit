import pymongo
import json
import os
import argparse
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
def get_user_data(email):
    """Retrieve user data based on email and return as JSON."""
    try:
        user_data = collection.find({"email": email})
        user_json = dumps(user_data, indent=4)
        return json.loads(user_json)
    except Exception as e:
        print(f"Error retrieving user data: {e}")
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

# Main execution with argparse
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Retrieve user data by email.")
    parser.add_argument("--email", required=True, help="User's email address.")
    args = parser.parse_args()

    user_profile = get_user_data(args.email)

    if user_profile:
        print(json.dumps(user_profile, indent=4))
        save_to_json_file(user_profile, OUTPUT_FILE)
    else:
        print("No user found matching the query.")
