import pandas as pd
import json

# CSV files to process (same as used for embedding generation)
csv_files = [
    "datasets/collegiate_athlete_injury_dataset.csv",
    "datasets/gym_exercises_dataset.csv",
    "datasets/injury_data.csv",
    "datasets/megaGymDataset.csv",
    "datasets/tagged_exercise_dataset.csv",
    "datasets/top_50_exercises.csv"
]

# Collect text chunks from all datasets
text_chunks = []

for file_path in csv_files:
    try:
        df = pd.read_csv(file_path)
        print(f"Processing {file_path} with {len(df)} rows.")
        
        for _, row in df.iterrows():
            text_chunk = " | ".join(str(value) for value in row.values if pd.notnull(value))
            text_chunks.append(text_chunk)
    except Exception as e:
        print(f"Failed to process {file_path}: {e}")

# Save text chunks to a JSON file for FAISS retrieval
with open("text_chunks.json", "w") as f:
    json.dump(text_chunks, f, indent=4)

print(f"Generated {len(text_chunks)} text chunks and saved to 'text_chunks.json'.")
