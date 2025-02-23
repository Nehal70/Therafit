import Session from "../models/session.js";
import User from "../models/user.js";
import { exec } from "child_process";
import axios from "axios";
import mongoose from "mongoose";

// Start a new session
// Start a new session and save it to MongoDB
export const startSession = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user's email from MongoDB
    const user = await User.findById(userId);
    const email = user?.email;
    if (!email) {
      return res.status(404).json({ error: "User email not found." });
    }

    const session = new Session({ userId });
    await session.save();

    // Run Python script with retrieved email
    const pythonCommand = `python ../ai_models/mongo_retrieve_data.py --email "${email}"`;

    exec(pythonCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error running Python script:", error.message);
        return res.status(500).json({ error: "Failed to run Python script" });
      }
      console.log("✅ Python Script Output:", stdout);
    });

    res.status(201).json({
      message: "Session started successfully",
      sessionId: session._id,
    });
  } catch (error) {
    console.error("❌ Error starting session:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
};
// Add a message to a session
export const addMessageToSession = async (req, res) => {
  try {
    const { sessionId, sender, text } = req.body;

    // 🟢 Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      console.error("❌ Session not found for ID:", sessionId);
      return res.status(404).json({ error: "Session not found" });
    }

    // 🟢 1. Save User Message in MongoDB
    const userMessage = { sender, text, timestamp: new Date() };
    session.messages.push(userMessage); // ✅ Add user message to session

    // 🟢 2. Call Python API for AI Response
    const aiResponse = await axios.post("http://localhost:5002/api/chat", {
      text,
    });

    const {
      userMessage: savedUserMessage,
      botMessage,
      exercise,
    } = aiResponse.data;

    // 🟢 3. Save Bot Message in MongoDB
    if (botMessage && botMessage.text) {
      session.messages.push({
        sender: botMessage.sender || "chatbot",
        text: botMessage.text,
        timestamp: new Date(),
      });
    } else {
      console.warn("⚠️ No bot message received from AI.");
    }

    // 🟢 4. Save Exercise to MongoDB (if valid)
    if (exercise && exercise.name && typeof exercise.duration === "number") {
      const exerciseEntry = {
        name: exercise.name,
        description: exercise.description || "No description provided",
        duration: exercise.duration,
        recommendedAt: new Date(),
        feedback: "",
      };
      session.workout.push(exerciseEntry); // ✅ Save valid exercise
    } else {
      console.log("⚠️ Invalid exercise, skipping MongoDB save.");
    }

    // 🟢 5. Save Session with Messages and Exercise
    await session.save();

    // 🟢 6. Send Response Back to Frontend
    res.status(200).json({
      userMessage: userMessage,
      botMessage: botMessage,
      exercise: exercise,
    });
  } catch (error) {
    console.error("❌ Error processing message:", error.message);
    res.status(500).json({ error: "Failed to process message." });
  }
};

// Add an exercise to a session
export const addExerciseToSession = async (req, res) => {
  try {
    const { sessionId, name, description, duration, feedback } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const exercise = {
      name,
      description,
      duration,
      feedback,
    };

    session.workout.push(exercise);
    await session.save();

    res.status(200).json({ message: "Exercise added to session", session });
  } catch (error) {
    res.status(500).json({ error: "Error adding exercise to session" });
  }
};

// View a session (Read a session)
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId).populate(
      "userId",
      "firstName lastName"
    );
    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Error fetching session" });
  }
};

// Update a session (add messages or exercises)
export const updateSession = async (req, res) => {
  try {
    const { sessionId, messages, workout } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Update the session with new messages or exercises
    if (messages) {
      session.messages.push(...messages);
    }
    if (workout) {
      session.workout.push(...workout);
    }

    session.updatedAt = new Date(); // Set updatedAt when modified
    await session.save();

    res.status(200).json({ message: "Session updated successfully", session });
  } catch (error) {
    res.status(500).json({ error: "Error updating session" });
  }
};

export const archiveConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;

    console.log(`🔄 Archiving conversation for session ID: ${sessionId}`);

    // 🟢 1. Call Flask API to archive JSON only
    const flaskResponse = await axios.post(
      "http://localhost:5002/api/archive-conversation",
      { sessionId }
    );

    if (flaskResponse.status !== 200) {
      console.error("❌ Failed to archive JSON in Flask.");
      return res.status(500).json({ error: "Flask archive failed." });
    }

    console.log("✅ Flask archive successful!");

    // 🟢 2. Do NOT clear MongoDB messages, only clear JSON history
    console.log("✅ Chat cleared from JSON, MongoDB messages remain intact.");

    res.status(200).json({
      message: "Chat archived in JSON and cleared successfully.",
      flaskMessage: flaskResponse.data.message,
    });
  } catch (error) {
    console.error("❌ Error archiving conversation:", error.message);
    res.status(500).json({ error: "Failed to archive conversation." });
  }
};

// Delete a session
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.sessionId);
    if (!session) return res.status(404).json({ error: "Session not found" });

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting session" });
  }
};
