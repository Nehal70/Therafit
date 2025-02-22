# ai_main.py

import os
import asyncio
import time
import json
import numpy as np
import faiss
import openai
from google import genai
from google.genai.types import LiveConnectConfig
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()
PROJECT_ID = "avian-altar-451715-u7"
LOCATION = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL_ID = "gemini-2.0-flash-exp"

# Initialize Gemini client
client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
config = LiveConnectConfig(response_modalities=["TEXT"])

# Set OpenAI API key for embeddings
openai.api_key = OPENAI_API_KEY

# FAISS index and text chunks paths
FAISS_INDEX_PATH = "./datasets/exercise_embeddings.index"
TEXT_CHUNKS_PATH = "./datasets/text_chunks.json"

# Load FAISS index
if os.path.exists(FAISS_INDEX_PATH):
    index = faiss.read_index(FAISS_INDEX_PATH)
else:
    raise FileNotFoundError(f"FAISS index '{FAISS_INDEX_PATH}' not found.")

# Load text chunks
if os.path.exists(TEXT_CHUNKS_PATH):
    with open(TEXT_CHUNKS_PATH, "r") as f:
        text_chunks = json.load(f)
else:
    raise FileNotFoundError(f"Text chunks file '{TEXT_CHUNKS_PATH}' not found.")

# Load user profile for context
def load_user_profile(profile_path="json_memory/user_profile.json"):
    try:
        with open(profile_path, "r") as file:
            profile_data = json.load(file)
        return profile_data[0] if isinstance(profile_data, list) else profile_data
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Generate embeddings using OpenAI API
def generate_embedding(text):
    try:
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        return np.array(response.data[0].embedding, dtype='float32')
    except Exception as e:
        print(f"Failed to generate embedding for: {text}\nError: {e}")
        return None

# Search FAISS index for exercise recommendations
def search_exercises(query, top_k=1):
    query_embedding = generate_embedding(query)
    if query_embedding is None:
        return []

    query_embedding = query_embedding.reshape(1, -1)
    distances, indices = index.search(query_embedding, top_k)

    results = []
    for idx in indices[0]:
        if idx < len(text_chunks):
            results.append(text_chunks[idx])

    return results

# Assistant role prompt and conversation flow
assistant_role = """
You are an expert injury recovery assistant. Your job is to follow this conversation flow:
1. **Collect User Profile:** Check if user profile exists in 'user_profile.json'. If not, ask for age, gender, weight, height, and injury type. Once collected, save it and do not ask again.
2. **Assess Injury:** Ask about current pain and previous injury.
3. **Generate Personalized Workout:** Suggest exercises one-by-one, considering user feedback and duration.
   - When suggesting the exercise, just suggest ONE exercise, and be specific. 
   - Always provide the name of the exercise, a clear description, and the duration in minutes.
   - If no description is available, generate a reasonable one.
4. **Recovery Tips:** After workout completion, provide warm-up, cool-down, and rest recommendations.
5. **Feedback:** After the workout, ask how they felt and adjust future recommendations.
"""

# User profile context
user_profile = load_user_profile()
user_context = "\n".join(f"{key}: {value}" for key, value in user_profile.items())

# Extract workout details from AI response
def extract_workout_details(response):
    """Extracts workout details from AI response."""
    exercise, description, duration = "N/A", "N/A", "N/A"
    lines = response.split("\n")

    for line in lines:
        if "Exercise:" in line or "Name:" in line:
            exercise = line.split(":")[1].strip()
        elif "Description:" in line:
            description = line.split(":")[1].strip()
        elif "Duration:" in line:
            duration = line.split(":")[1].strip()

    return {
        "name": exercise,
        "description": description,
        "duration": duration,
        "recommendedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

# Chat with Gemini and get responses
async def chat_with_gemini(user_input):
    """Generates AI response and returns conversation and workout data."""
    async with client.aio.live.connect(model=MODEL_ID, config=config) as session:
        # Retrieve exercises from FAISS
        retrieved_exercises = search_exercises(user_input)
        exercises_context = "\n".join(retrieved_exercises) if retrieved_exercises else "No relevant exercises found."

        # Contextual prompt with assistant role, user profile, and exercise context
        contextual_input = f"""
{assistant_role}

User Profile:
{user_context}

User's Message:
{user_input}

Relevant Exercise Recommendations:
{exercises_context}

Based on the user's injury history and fitness goals, suggest safe and effective exercises.
Ensure you provide the exercise name, description, and duration.
"""

        # Send prompt to Gemini
        await session.send(input=contextual_input, end_of_turn=True)

        # Collect AI response
        response = []
        async for message in session.receive():
            if message.text:
                response.append(message.text)

        gemini_response = ''.join(response)

        # Extract workout entry from response
        workout_entry = extract_workout_details(gemini_response)

        return gemini_response, workout_entry
