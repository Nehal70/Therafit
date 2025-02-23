import express from 'express';
import {
  startSession,
  addMessageToSession,
  addExerciseToSession,
  getSession,
  updateSession,
  deleteSession,
  archiveConversation,
} from "../controllers/sessionController.js";
import Session from "../models/session.js"; // Adjust path as needed
import mongoose from 'mongoose';


const router = express.Router();

// Route to start a new session
router.post("/start", startSession);

// Route to add a message to an existing session
router.post("/message", addMessageToSession);

router.post("/archive-conversation", archiveConversation);

// Route to add an exercise to an existing session
router.post("/exercise", addExerciseToSession);

// Route to get a session's details
router.get("/:sessionId", getSession);

// Route to update a session (add messages or exercises)
router.put("/update", updateSession);

// Route to delete a session
router.delete("/:sessionId", deleteSession);

// Route to get all sessions for a specific user
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Log userId to ensure it is being passed correctly
    console.log(`Fetching sessions for userId: ${userId}`);

    // Convert userId to ObjectId if it isn't already
    const userIdObjectId = new mongoose.Types.ObjectId(userId);

    // Find all sessions with the given userId
    const sessions = await Session.find({ userId: userIdObjectId }).exec();

    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found for this user" });
    }

    // Return the sessions found for the given userId
    res.status(200).json(sessions);
  } catch (error) {
    // Log the error to get more details
    console.error("❌ Error fetching sessions:", error);

    // Send back the full error message and stack trace in the response
    res.status(500).json({
      message: "Failed to fetch sessions",
      error: error.message || error.stack,
    });
  }
});

export default router;