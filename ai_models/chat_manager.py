# chat_manager.py

import json
from datetime import datetime
from gpt4o_main import process_user_input

# JSON paths
CONVERSATION_HISTORY_PATH = "./json_memory/conversation_history.json"
WORKOUT_HISTORY_PATH = "./json_memory/workout_history.json"
USER_PROFILE_PATH = "../server/json_memory/user_profile.json"
MAIN_HISTORY_PATH = "./json_memory/main_history.json"

# Load JSON or create empty if missing
def load_json(file_path):
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

# Save JSON data
def save_json(file_path, data):
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)

# Load user profile
def load_user_profile():
    try:
        with open(USER_PROFILE_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Archive conversation to main_history.json on exit
def archive_conversation():
    """Move conversation_history.json content to main_history.json upon exit."""
    conversation_history = load_json(CONVERSATION_HISTORY_PATH)
    if not conversation_history:
        return

    main_history = load_json(MAIN_HISTORY_PATH)

    # Archive the conversation with timestamp
    archive_entry = {
        "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "convo": conversation_history
    }

    # Append to main history and save
    main_history.append(archive_entry)
    save_json(MAIN_HISTORY_PATH, main_history)

    # Clear the temporary conversation history
    save_json(CONVERSATION_HISTORY_PATH, [])

# Run the conversation
def run_chat():
    conversation_history = load_json(CONVERSATION_HISTORY_PATH)
    workout_history = load_json(WORKOUT_HISTORY_PATH)
    user_profile = load_user_profile()

    print("Chat started! Type 'exit' to end.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "q"]:
            print("Exiting chat and archiving conversation...")
            archive_conversation()  # Archive chat before exit
            break

        # Log user input
        conversation_history.append({
            "sender": "user",
            "text": user_input,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        })

        # Get GPT-4o response and workout suggestion
        gpt4o_response, workout_entry = process_user_input(user_input, user_profile)

        # Log AI response
        conversation_history.append({
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "sender": "chatbot",
            "text": gpt4o_response
        })

        # Save conversation history
        save_json(CONVERSATION_HISTORY_PATH, conversation_history)

        # Save workout history if a valid workout was found
        if "exercise" not in workout_entry or workout_entry["exercise"] != "N/A":
            workout_history.append(workout_entry)
            save_json(WORKOUT_HISTORY_PATH, workout_history)

        print(f"\n**FitBuddy:** {gpt4o_response}\n")

# Start the chat manager
if __name__ == "__main__":
    run_chat()
