import os
import pandas as pd
import numpy as np
import faiss
import openai
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


# CSV files to process
csv_files = [
    "datasets/collegiate_athlete_injury_dataset.csv",
    "datasets/gym_exercises_dataset.csv",
    "datasets/injury_data.csv",
    "datasets/megaGymDataset.csv",
    "datasets/tagged_exercise_dataset.csv",
    "datasets/top_50_exercises.csv"
]

# Function to generate embeddings using OpenAI's new API
def generate_embedding(text):
    try:
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-ada-002"  # Best model for efficient embeddings
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Failed to generate embedding for: {text}\nError: {e}")
        return None

# Prepare text chunks and embeddings from CSV datasets
text_chunks = []
embeddings = []

for file_path in csv_files:
    try:
        df = pd.read_csv(file_path)
        print(f"\nProcessing {file_path} with {len(df)} rows.")
        
        # Combine relevant columns into text chunks
        for _, row in df.iterrows():
            text_chunk = " | ".join(str(value) for value in row.values if pd.notnull(value))
            text_chunks.append(text_chunk)
            
            # Generate embedding
            embedding = generate_embedding(text_chunk)
            if embedding:
                embeddings.append(embedding)
    except Exception as e:
        print(f"Failed to process {file_path}: {e}")

# Convert embeddings to NumPy array for FAISS
embeddings = np.array(embeddings).astype('float32')

# Save text chunks for future retrieval
with open("text_chunks.json", "w") as f:
    json.dump(text_chunks, f, indent=4)

print(f"\nGenerated {len(embeddings)} embeddings.")

# Create FAISS index and store embeddings
if len(embeddings) > 0:
    embedding_dim = len(embeddings[0])  # Get embedding size
    index = faiss.IndexFlatL2(embedding_dim)
    index.add(embeddings)

    # Save FAISS index
    faiss.write_index(index, "exercise_embeddings.index")
    print("FAISS index saved as 'exercise_embeddings.index'.")
else:
    print("No embeddings generated. Check for errors in the datasets.")
