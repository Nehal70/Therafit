import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'chatbot'], required: true }, // Who sent the message
  text: { type: String, required: true }, // Message content
  timestamp: { type: Date, default: Date.now }, // Time the message was sent
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Exercise name
  description: { type: String }, // Short description of the exercise
  duration: { type: Number, required: true }, // Duration in minutes
  recommendedAt: { type: Date, default: Date.now }, // When the exercise was recommended
  feedback: { type: String } // User's feedback on the exercise
});

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  messages: [messageSchema], // Conversation history
  workout: [exerciseSchema], // List of exercises in the workout
  sessionStart: { type: Date, default: Date.now }, // When the session started
  sessionEnd: { type: Date } // When the session ended
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
