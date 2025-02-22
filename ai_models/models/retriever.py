import os
from langchain.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

# Load FAISS vector store
embeddings = OpenAIEmbeddings(openai_api_key=API_KEY)
vector_store = FAISS.load_local("./datasets/exercise_embeddings.faiss", embeddings, allow_dangerous_deserialization=True)

def search_exercises(query, k=3):
    """Search for the most relevant exercises based on the query."""
    results = vector_store.similarity_search(query, k=k)
    return [(result.page_content, result.metadata['name']) for result in results]

if __name__ == "__main__":
    user_query = input("Enter your injury or workout preference: ")
    exercises = search_exercises(user_query)
    print("\nRecommended Exercises:")
    for exercise, name in exercises:
        print(f"- {name}: {exercise}")
