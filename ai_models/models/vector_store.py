import os
import pandas as pd
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")

# Load exercise dataset
csv_path = "./datasets/tagged_exercise_dataset.csv"
df = pd.read_csv(csv_path)

# Prepare documents for embedding
def create_documents(df):
    documents = []
    for _, row in df.iterrows():
        content = f"Exercise: {row['Exercise']}. Body Part: {row['Body_Part']}. Intensity: {row['Intensity']}. Equipment: {row['Equipment']}. Benefit: {row['Benefit']}"
        doc = Document(page_content=content, metadata={"name": row['Exercise']})
        documents.append(doc)
    return documents

# Generate vector embeddings
def generate_faiss_store():
    print("Generating FAISS vector store...")
    embeddings = OpenAIEmbeddings(openai_api_key=API_KEY)
    documents = create_documents(df)
    vector_store = FAISS.from_documents(documents, embeddings)
    vector_store.save_local("./datasets/exercise_embeddings.faiss")
    print("FAISS vector store created successfully!")

if __name__ == "__main__":
    generate_faiss_store()