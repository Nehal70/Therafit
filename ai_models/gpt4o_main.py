# gpt4o_main.py

import os
import json
import numpy as np
import faiss
import openai
from dotenv import load_dotenv
from datetime import datetime
from openai import OpenAI
from langchain.memory import ConversationBufferMemory

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# Paths to FAISS index and text chunks
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

# Initialize memory for conversation
memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

# Generate query embeddings using OpenAI
def generate_embedding(text):
    """Generate embeddings using OpenAI's GPT-4o."""
    try:
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        return np.array(response.data[0].embedding, dtype='float32')
    except Exception as e:
        print(f"Failed to generate embedding for: {text}\nError: {e}")
        return None

# Search FAISS index for exercises
def search_exercises(query, top_k=1):
    """Retrieve relevant exercises from FAISS based on user input."""
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

# Generate conversation response using GPT-4o with memory
def get_gpt4o_response(user_input, exercise_context, user_profile):
    """Interact with GPT-4o using OpenAI v1.0+ syntax and conversation memory."""

    # Build the conversation prompt with memory
    chat_history = memory.load_memory_variables({})
    history_context = chat_history.get("chat_history", "")

    prompt = f"""
You are an expert injury recovery assistant. Your job is to follow this conversation flow:
1. **Collect User Profile:** Check if user profile exists in 'user_profile.json'. If not, ask for age, gender, weight, height, and injury type. Once collected, save it and do not ask again.
2. **Assess Injury:** Ask about current pain and previous injury.
3. **Generate Personalized Workout:** Suggest exercises one-by-one, considering user feedback and duration.
When suggesting the exercise, just suggest ONE exercise, and be specific. Give the name of the exercise, description, duration in minutes.
Remember to ALWAYS follow that above format when giving exercises -- exercise, description, and duration. 
If there's no description available create a reasonable one or whatever you can find. 
4. **Recovery Tips:** After workout completion, provide warm-up, cool-down, and rest recommendations.
5. **Feedback:** After the workout, ask how they felt and adjust future recommendations.

Conversation History:
{history_context}

User Profile:
{user_profile}

User's Message:
{user_input}

Relevant Exercise Recommendations:
{exercise_context}

Based on the user’s injury history and fitness goals, suggest a safe and effective exercise. Always provide the exercise name, description, and duration.
"""

    try:
        # Initialize OpenAI client
        client = openai.Client()

        # API call using the new syntax
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful injury recovery assistant. Use the following context and prompt and follow it to the best of your ability."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        # Get the response
        gpt4o_response = response.choices[0].message.content

        # Update conversation memory
        memory.save_context({"input": user_input}, {"output": gpt4o_response})

        return gpt4o_response

    except Exception as e:
        print(f"Failed to generate GPT-4o response: {e}")
        return "I'm sorry, I couldn't process your request."

# Extract workout details from GPT response
def extract_workout_details(response):
    """Extract workout name, description, and duration from GPT response."""
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

# Main function to handle user input
def process_user_input(user_input, user_profile):
    """Process user input, retrieve exercises, and get GPT-4o response."""
    # Search FAISS for relevant exercises
    retrieved_exercises = search_exercises(user_input)
    exercise_context = "\n".join(retrieved_exercises) if retrieved_exercises else "No relevant exercises found."

    # Get GPT-4o response
    gpt4o_response = get_gpt4o_response(user_input, exercise_context, user_profile)

    # Extract workout details from the response
    workout_entry = extract_workout_details(gpt4o_response)

    return gpt4o_response, workout_entry
