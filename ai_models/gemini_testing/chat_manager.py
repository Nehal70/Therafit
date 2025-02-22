# chat_manager.py

import json
import asyncio
from datetime import datetime
from gpt4o_main import process_user_input
from langchain.memory import ConversationBufferMemory

# JSON file paths
CONVERSATION_HISTORY_PATH = "./json_memory/conversation_history.json"
WORKOUT_HISTORY_PATH = "./json_memory/workout_history.json"

# Initialize memory for session
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Load existing JSON or create new ones
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

# Function to handle chat and save results
async def run_chat():
    conversation_history = load_json(CONVERSATION_HISTORY_PATH)
    workout_history = load_json(WORKOUT_HISTORY_PATH)

    print("Chat started! Type 'exit' to end.\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "q"]:
            print("Exiting chat.")
            break

        # Log user message
        conversation_history.append({
            "sender": "user",
            "text": user_input,
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

        # Get AI response and workout entry
        ai_response, workout_entry = process_user_input(user_input, user_profile={})

        # Log AI response
        conversation_history.append({
            "sender": "chatbot",
            "text": ai_response,
            "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

        # Update conversation memory
        memory.save_context({"input": user_input}, {"output": ai_response})

        # Save conversation history
        save_json(CONVERSATION_HISTORY_PATH, conversation_history)

        # Save workout history if valid
        if "exercise" not in workout_entry.keys() or workout_entry["exercise"] != "N/A":
            workout_history.append(workout_entry)
            save_json(WORKOUT_HISTORY_PATH, workout_history)

        print(f"\n**FitBuddy:** {ai_response}\n")

# Run chat manager
if __name__ == "__main__":
    asyncio.run(run_chat())
