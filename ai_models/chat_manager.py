import json
import os
from datetime import datetime
from gpt4o_main import process_user_input
from flask import Flask, request, jsonify
from flask_cors import CORS

# Flask app setup
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# JSON paths (ensure paths are absolute for stability)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONVERSATION_HISTORY_PATH = os.path.join(BASE_DIR, "json_memory/conversation_history.json")
WORKOUT_HISTORY_PATH = os.path.join(BASE_DIR, "json_memory/workout_history.json")
USER_PROFILE_PATH = os.path.join(BASE_DIR, "../server/json_memory/user_profile.json")
MAIN_HISTORY_PATH = os.path.join(BASE_DIR, "json_memory/main_history.json")

# Load JSON or create empty if missing
def load_json(file_path):
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save JSON data safely
def save_json(file_path, data):
    try:
        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"❌ Failed to save JSON at {file_path}: {e}")

# Load user profile
def load_user_profile():
    return load_json(USER_PROFILE_PATH)

# Archive conversation and clear history
def archive_conversation():
    
    try:
        conversation_history = load_json(CONVERSATION_HISTORY_PATH)
        if not conversation_history:
            print("⚠️ No conversation history found to archive.")
            return False  # Nothing to archive

        main_history = load_json(MAIN_HISTORY_PATH)

        # Archive with timestamp
        archive_entry = {
            "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "convo": conversation_history
        }

        # Append to archive and save
        main_history.append(archive_entry)
        save_json(MAIN_HISTORY_PATH, main_history)

        # Clear conversation history
        save_json(CONVERSATION_HISTORY_PATH, [])
        print("✅ Conversation archived and cleared successfully.")

        return True

    except Exception as e:
        print(f"❌ Error archiving conversation: {e}")
        return False

# 🚀 Archive API Endpoint
@app.route("/api/archive-conversation", methods=["POST"])
def archive_conversation_endpoint():
    if archive_conversation():
        return jsonify({"message": "Conversation archived and cleared successfully."}), 200
    else:
        return jsonify({"message": "No conversation history to archive."}), 200

# 🔑 Process User Message
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("text")
    user_profile = load_user_profile()

    if not user_input:
        return jsonify({"error": "User input is required"}), 400

    # Log user message
    conversation_history = load_json(CONVERSATION_HISTORY_PATH)
    user_message = {
        "sender": "user",
        "text": user_input,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    conversation_history.append(user_message)

    # Generate AI response and workout suggestion
    gpt4o_response, workout_entry = process_user_input(user_input, user_profile)

    # 🟢 Convert duration from "5 minutes" to seconds
    if workout_entry and workout_entry.get("duration"):
        duration_str = workout_entry["duration"]
        try:
            # Extract number from string and convert to seconds
            duration_minutes = int(''.join(filter(str.isdigit, duration_str)))
            workout_entry["duration"] = duration_minutes * 60  # Convert to seconds
        except ValueError:
            workout_entry["duration"] = 0  # Set to 0 if invalid

    # Log AI response
    bot_message = {
        "sender": "chatbot",
        "text": gpt4o_response,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    conversation_history.append(bot_message)

    # Save conversation history
    save_json(CONVERSATION_HISTORY_PATH, conversation_history)

    # Save workout history if valid
    if workout_entry and workout_entry.get("name") and workout_entry["duration"] > 0:
        workout_history = load_json(WORKOUT_HISTORY_PATH)
        workout_history.append(workout_entry)
        save_json(WORKOUT_HISTORY_PATH, workout_history)

    # Return user message, bot message, and exercise
    return jsonify({
        "userMessage": user_message,
        "botMessage": bot_message,
        "exercise": workout_entry
    })




# Start Flask server
if __name__ == "__main__":
    app.run(port=5002, debug=True)
