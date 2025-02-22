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

# Load environment variables
load_dotenv()
PROJECT_ID = "avian-altar-451715-u7"
LOCATION = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL_ID = "gemini-2.0-flash-exp"

# Initialize the Gemini client
client = genai.Client(vertexai=True, project=PROJECT_ID, location=LOCATION)
config = LiveConnectConfig(response_modalities=["TEXT"])

# Set OpenAI API key for embeddings

# Load FAISS index and text chunks
FAISS_INDEX_PATH = "./datasets/exercise_embeddings.index"
TEXT_CHUNKS_PATH = "./datasets/text_chunks.json"

# Load FAISS index
if os.path.exists(FAISS_INDEX_PATH):
    index = faiss.read_index(FAISS_INDEX_PATH)
    print(f"Loaded FAISS index from '{FAISS_INDEX_PATH}'.")
else:
    raise FileNotFoundError(f"FAISS index '{FAISS_INDEX_PATH}' not found.")

# Load text chunks
if os.path.exists(TEXT_CHUNKS_PATH):
    with open(TEXT_CHUNKS_PATH, "r") as f:
        text_chunks = json.load(f)
    print(f"Loaded {len(text_chunks)} text chunks from '{TEXT_CHUNKS_PATH}'.")
else:
    raise FileNotFoundError(f"Text chunks file '{TEXT_CHUNKS_PATH}' not found.")

# Function to generate query embeddings using OpenAI
def generate_embedding(text):
    """Generate embeddings for a given text using OpenAI API."""
    try:
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        return np.array(response.data[0].embedding, dtype='float32')
    except Exception as e:
        print(f"Failed to generate embedding for: {text}\nError: {e}")
        return None

# Function to search FAISS index and retrieve exercise recommendations
def search_exercises(query, top_k=5):
    """Retrieve the most relevant exercises from FAISS based on user input."""
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

# Load user profile from JSON file
def load_user_profile(profile_path="json_memory/user_profile.json"):
    """Load user profile for context."""
    try:
        with open(profile_path, "r") as file:
            profile_data = json.load(file)
        return profile_data[0] if isinstance(profile_data, list) and profile_data else profile_data
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

# Prepare user context from profile
user_profile = load_user_profile()
user_context = "\n".join(f"{key}: {value}" for key, value in user_profile.items())

# Define the assistant's role and task
assistant_role = """
You are an expert injury recovery assistant. Your job is to follow this conversation flow:
1. **Collect User Profile:** Check if user profile exists in 'user_profile.json'. If not, ask for age, gender, weight, height, and injury type. Once collected, save it and do not ask again.
2. **Assess Injury:** Ask about current pain and previous injury.
3. **Generate Personalized Workout:** Suggest exercises one-by-one, considering user feedback and duration.
When suggesting the exercise, just suggest ONE exercise, and be specific. Give the name of the exercise, description, duration in minutes.
4. **Recovery Tips:** After workout completion, provide warm-up, cool-down, and rest recommendations.
5. **Feedback:** After the workout, ask how they felt and adjust future recommendations.
"""

# Function to interact with Gemini
async def interact_with_gemini(session, text_input):
    """Send user query, retrieve context from FAISS, and pass it to Gemini."""
    print(f"\n**You:** {text_input}")

    # Retrieve relevant exercises from FAISS
    retrieved_exercises = search_exercises(text_input)
    exercises_context = "\n".join(retrieved_exercises) if retrieved_exercises else "No relevant exercises found."

    # Create contextual prompt for Gemini
    contextual_input = f"""{assistant_role}

User Profile:
{user_context}

User's Message:
{text_input}

Relevant Exercise Recommendations:
{exercises_context}

Based on the user's injury history and fitness goals, suggest safe and effective exercises.
"""

    # Send the contextualized input to Gemini
    await session.send(input=contextual_input, end_of_turn=True)

    # Collect and display the response
    response = []
    async for message in session.receive():
        if message.text:
            response.append(message.text)

    print(f"\n**FitBuddy:** {''.join(response)}\n")

# Main async function
async def main():
    """Main function to handle user conversation and exercise recommendations."""
    try:
        async with client.aio.live.connect(model=MODEL_ID, config=config) as session:
            print("Session started successfully. Type 'exit' to end the chat.\n")

            while True:
                user_input = input("You: ")
                if user_input.lower() in ("exit", "quit", "q"):
                    print("Exiting chat.")
                    break

                # Send message and receive response with FAISS context
                await interact_with_gemini(session, user_input)

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        print("\nSession closed.")

if __name__ == "__main__":
    asyncio.run(main())
