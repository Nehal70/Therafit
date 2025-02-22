import os
import json
from dotenv import load_dotenv
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from openai import OpenAI
import pandas as pd

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI API
client = OpenAI(api_key=API_KEY)

# Load FAISS vector store
embeddings = OpenAIEmbeddings(openai_api_key=API_KEY)
vector_store = FAISS.load_local("./datasets/exercise_embeddings.faiss", embeddings, allow_dangerous_deserialization=True)

# Load exercise dataset for video links
exercise_df = pd.read_csv("./datasets/gym_exercises_dataset.csv")

# User preferences storage
USER_PREFERENCES_FILE = "./datasets/user_preferences.json"

def load_user_preferences():
    if os.path.exists(USER_PREFERENCES_FILE):
        with open(USER_PREFERENCES_FILE, 'r') as file:
            return json.load(file)
    return {}

def save_user_preferences(preferences):
    with open(USER_PREFERENCES_FILE, 'w') as file:
        json.dump(preferences, file, indent=4)

def get_exercise_video(exercise_name):
    """Retrieve video link for a given exercise from the dataset."""
    result = exercise_df[exercise_df['Exercise_Name'].str.contains(exercise_name, case=False, na=False)]
    if not result.empty:
        return result.iloc[0]['Description_URL']
    return "No video available."

def search_exercises(query, k=3):
    """Search for exercises using FAISS vector store."""
    results = vector_store.similarity_search(query, k=k)
    return [(result.page_content, result.metadata['name']) for result in results]

def adapt_exercise_based_on_mood(mood, exercises):
    """Adjust exercise suggestions based on user's mood."""
    if mood.lower() in ['tired', 'sore', 'fatigued']:
        print("User is tired. Suggesting low-intensity exercises.")
        return [ex for ex in exercises if 'Low' in ex[0]]
    elif mood.lower() in ['energetic', 'ready', 'pumped']:
        print("User is energetic. Suggesting higher-intensity exercises.")
        return [ex for ex in exercises if 'High' in ex[0]]
    return exercises

def chat_with_ai(prompt):
    """Interact with the fine-tuned OpenAI model."""
    response = client.chat.completions.create(
        model="ft:gpt-4o-2024-08-06:personal::B3ZVjSZi",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

def main():
    print("Welcome to the Personalized Workout Assistant!\n")
    user_preferences = load_user_preferences()

    user_name = input("What is your name? ")
    if user_name not in user_preferences:
        user_preferences[user_name] = {"mood": "neutral", "past_exercises": []}

    while True:
        user_input = input("\nUser: ")

        if user_input.lower() == "exit":
            print("Goodbye! Stay healthy!")
            break

        if "workout" in user_input.lower():
            query = input("Describe your condition or workout preference: ")
            exercises = search_exercises(query)

            mood = user_preferences[user_name].get("mood", "neutral")
            exercises = adapt_exercise_based_on_mood(mood, exercises)

            print("\nRecommended Exercises:")
            for exercise, name in exercises:
                video_link = get_exercise_video(name)
                print(f"- {name}: {exercise}\n  Video: {video_link}\n")

            user_feedback = input("How do you feel after this suggestion (good, tired, etc.)? ")
            user_preferences[user_name]['mood'] = user_feedback.lower()
            user_preferences[user_name]['past_exercises'].extend([name for _, name in exercises])
            save_user_preferences(user_preferences)

        else:
            response = chat_with_ai(user_input)
            print(f"AI: {response}\n")

if __name__ == "__main__":
    main()