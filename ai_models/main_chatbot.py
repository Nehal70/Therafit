import os
import json
import pandas as pd
import speech_recognition as sr
import pyttsx3
from datetime import datetime
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv

# Load environment variables (API key)
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Create json_memory folder if not exists
os.makedirs("./json_memory", exist_ok=True)

# User profile path
USER_PROFILE_PATH = "./json_memory/user_profile.json"
WORKOUT_PROGRESS_PATH = "./json_memory/workout_progress.json"
WORKOUT_HISTORY_PATH = "./json_memory/workout_history.json"

# Initialize OpenAI LLM using the fine-tuned model
fine_tuned_model = "ft:gpt-4o-2024-08-06:personal::B3ZVjSZi"
llm = ChatOpenAI(model=fine_tuned_model, temperature=0.7, openai_api_key=openai_api_key)

# Initialize FAISS vector store for RAG
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
vector_store = FAISS.load_local("./datasets/exercise_embeddings.faiss", embeddings, allow_dangerous_deserialization=True)

# Initialize text-to-speech engine
engine = pyttsx3.init()
engine.setProperty('rate', 150)

# Load user profile from JSON
def load_user_profile():
    if os.path.exists(USER_PROFILE_PATH):
        with open(USER_PROFILE_PATH, 'r') as file:
            return json.load(file)
    return {}

# Save user profile to JSON
def save_user_profile(profile):
    with open(USER_PROFILE_PATH, 'w') as file:
        json.dump(profile, file, indent=4)

# Load workout progress from JSON
def load_workout_progress():
    if os.path.exists(WORKOUT_PROGRESS_PATH):
        with open(WORKOUT_PROGRESS_PATH, 'r') as file:
            return json.load(file)
    return {}

# Save workout progress to JSON
def save_workout_progress(progress):
    with open(WORKOUT_PROGRESS_PATH, 'w') as file:
        json.dump(progress, file, indent=4)

# Save workout history to JSON
def save_workout_history(user_input, assistant_response):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {
        "date_time": timestamp,
        "user_input": user_input,
        "assistant_response": assistant_response
    }

    if os.path.exists(WORKOUT_HISTORY_PATH):
        with open(WORKOUT_HISTORY_PATH, 'r') as file:
            history = json.load(file)
    else:
        history = []

    history.append(entry)

    with open(WORKOUT_HISTORY_PATH, 'w') as file:
        json.dump(history, file, indent=4)

# Updated system prompt
system_prompt = """
You are an expert injury recovery assistant. Your job is to strictly follow this conversation flow:
1. **Collect User Profile:** Check if user profile exists in 'user_profile.json'. If not, ask for age, gender, weight, height, and injury type. Once collected, save it and do not ask again.
IF IT ALREADY EXISTS, DO NOT ASK FOR IT AGAIN. REALLY, DO NOT.
2. **Assess Injury:** Based on user input, ask for pain level, previous injuries, and workout preferences. Save these details in the user profile. Once saved, do not ask for it again, and just retrieve it from the file.
3. **Generate Personalized Workout:** Suggest exercises suitable for their injury, considering workout duration. HOWEVER, you need to give the exercises one-by-one. You need to give an exercise and if it is the first exercise you are given (check the JSON file to see this) - then store that exercise to the JSON file. If it is not the first exercise, use what the user said about the previous exercises, including the time they spent, to recommend what is next.
Note that for the exercises, you need to give the name, the description, and the video link - exact name from the dataset. Give the time as well! and track the time as you always do. And please talk directly to the user, don't talk like "User intends to..." Say "You should spend ..."
4. **Track Workout:** Store workout progress in 'workout_progress.json' (exercises done, time spent, user feedback). Remember the time spent is crucial, collect this when the user explicitly says and only do it at the beginning, do not keep looking for it again, look for it in the JSON, it should be there.
5. **Recovery Tips:** Once the workout is "done" - (it is done when the workout times for each exercise reach the total time suggested by the user) - Provide warm-up, cool-down, and rest recommendations.
6. **Feedback:** After the workout, ask how they felt and adjust future recommendations.

Note some housekeeping things:
If the user says something what should I do, what should I do next, ..., just look at your context, and make sure that it's actually relevant, like don't start something new if a workout is going on. 

Follow these steps pretty much exactly, but use your own judgement sometimes too. For example, if the user's already created their profile and you see it in the JSON file, don't even think about asking the user again!
And try not to keep bringing up the user's profile except at the beginning, like that's the initialization stage.
"""

# Initialize memory for conversation context
memory = ConversationBufferMemory(memory_key="history", return_messages=True)

# Initialize conversation chain
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    input_key="input",
    verbose=True
)

def search_exercises(query, k=3):
    """Search exercises using FAISS vector store."""
    results = vector_store.similarity_search(query, k=k)
    return [(result.page_content, result.metadata['name']) for result in results]

# Load exercise dataset for video links
gym_exercises_df = pd.read_csv("./datasets/gym_exercises_dataset.csv")

def get_exercise_video(exercise_name):
    """Retrieve video link for a given exercise."""
    result = gym_exercises_df[gym_exercises_df['Exercise_Name'].str.contains(exercise_name, case=False, na=False)]
    if not result.empty:
        return result.iloc[0]['Description_URL']
    return "No video available."

def text_to_speech(text):
    """Convert text to speech and play it."""
    engine.say(text)
    engine.runAndWait()

def voice_input():
    """Capture voice input and convert to text."""
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("🎤 Listening...")
        try:
            audio = recognizer.listen(source, timeout=10)
            user_input = recognizer.recognize_google(audio)
            print(f"🗣️ You said: {user_input}")
            return user_input
        except sr.WaitTimeoutError:
            print("❌ Timeout! No speech detected.")
            return None
        except sr.UnknownValueError:
            print("❌ Sorry, could not understand the audio.")
            return None

def generate_workout(user_input):
    """Generate workout using RAG and suggest video links."""
    print("\n🔍 Searching for exercises...")
    exercises = search_exercises(user_input, k=1)
    if not exercises:
        return "No relevant exercises found. Please provide more details."

    suggestions = []
    progress = load_workout_progress()

    for exercise, name in exercises:
        video_link = get_exercise_video(name)
        suggestion = f"Exercise: {name}\nDescription: {exercise}\nVideo: {video_link}\n"
        suggestions.append(suggestion)
        text_to_speech(suggestion)

        # Track first exercise and follow-up logic
        if 'first_exercise' not in progress:
            progress['first_exercise'] = name
        else:
            progress['last_exercise'] = name

        save_workout_progress(progress)

    return "\n".join(suggestions)

# Function to handle user queries
def answer_query(user_input):
    user_profile = load_user_profile()

    if not user_profile:
        print("\n🟡 No user profile found. Collecting user details...")
        text_to_speech("No user profile found. Let's set it up.")
        age = input("Enter your age: ")
        gender = input("Enter your gender: ")
        weight = input("Enter your weight (kg): ")
        height = input("Enter your height (cm): ")
        injury_type = input("What injury are you dealing with? ")

        user_profile = {
            "age": age,
            "gender": gender,
            "weight": weight,
            "height": height,
            "injury_type": injury_type
        }
        save_user_profile(user_profile)
        text_to_speech("User profile created and saved.")
        print("\n✅ User profile created and saved.")

    prompt = f"{system_prompt}\nUser: {user_input}\nAssistant:"
    try:
        response = conversation.run({"input": prompt})
        print(f"\n🤖 **Response:** {response}")
        save_workout_history(user_input, response)
        text_to_speech(response)

    except Exception as e:
        print(f"❌ Error: {e}")

# Interactive chat loop
print("\n💬 **Injury Recovery Assistant** (Say 'exit' to quit)")

while True:
    user_input = voice_input()
    if user_input and user_input.lower() == "exit":
        print("\n💾 Saving conversation history...")
        save_workout_history("exit", "User exited the session.")
        text_to_speech("Goodbye! Stay healthy!")
        print("\n👋 Exiting the chat. Goodbye!")
        break
    if user_input:
        answer_query(user_input)