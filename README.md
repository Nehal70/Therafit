Hacklytics 2025. Link to Devpost: https://devpost.com/software/879051

Inspiration
TheraFit was born out of the need for a more accessible, personalized, and interactive way to approach physical therapy. Many people struggle to find the right exercises for their specific pain or injury, and often don’t have the support they need during their recovery journey. We wanted to create an app that would bridge that gap by offering a tailored workout experience powered by AI, with the guidance and feedback needed to support effective recovery.

What it does

- TheraFit is an AI-driven physical therapy coach designed to help users with strain, injuries, and general physical recovery. The app listens to the user’s pain points and recommends workouts based on their specific needs. Using a voice interface, it walks users through personalized, timed exercises, and collects feedback after each session to track progress and make adjustments. The workouts can be saved and accessed later, making it easy for users to continue their recovery journey over time.

- Therafit curates a playlist for the excercises you liked, allowing you to customise times, order, descriptions and names of each workout session and their excercises. It can be syncronised with personalised music to provide an immersive workout experience similar to listening to songs on spotify.

- Previous conversations are stored and context-driven so that users can request changes, and add or remove excercises as they see fit as the problem worsens or subdues.  

How we built it

- We built TheraFit using the MERN stack, leveraging MongoDB for database storage, React for the front-end interface, Express to handle backend operations, and JavaScript to tie it all together. The app uses a RAG (Retrieval-Augmented Generation) model trained on Kaggle datasets to deliver personalized, effective workout recommendations. Voice recognition and timers were integrated to provide a more immersive experience, allowing real-time interaction. The app is designed for scalability and responsiveness, utilizing the full power of the MERN stack to ensure smooth user experiences and efficient data processing.

- Langchain was used to finetune our LLM and to provide tools to extract the excercise, its timings, descriptions, etc. as well as to extract user information / user pain. Langchain tools were put together via langchain agent to create an agentic physical therapy assistant that could edit your excercise playlist and provide you recommendations all through natural language instructions. This was all put together in a Flask Server.

How to use it : 

1) Clone the github repository.
2) Create a .env file for server, client and ai_models
3) For the server .env file, add a valid MONGODB_URI, PORT=5000, JWT_SECRET
4) For the client .env file, add REACT_APP_API_URL, REACT_APP_ENVIRONMENT
5) For the ai_models .env file, add OPENAI_API_KEY, LANGCHAIN_TRACING_V2, LANGCHAIN_API_KEY, FLASK_PORT=5001
6) Install dependencies for each component:

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install AI model dependencies
cd ../ai_models
pip install -r requirements.txt

7) Start the application:

# Start the Flask AI server (in ai_models directory)
python app.py

# Start the Express server (in server directory)
npm start

# Start the React client (in client directory)
npm start

8) Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Models API: http://localhost:5001

Prerequisites
Node.js (v14 or higher)

Python (v3.8 or higher)

MongoDB (local installation or MongoDB Atlas)

OpenAI API key

LangChain API key (optional, for tracing)

Additional Setup Notes
Ensure your MongoDB instance is running before starting the server

The AI models require sufficient system memory for optimal performance

Voice recognition features may require microphone permissions in your browser

For production deployment, update the environment variables accordingly

This setup should get TheraFit running locally with all its AI-powered physical therapy features
