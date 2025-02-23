import express from "express";
import {
  startSession,
  addMessageToSession,
  addExerciseToSession,
  getSession,
  updateSession,
  deleteSession,
  archiveConversation,
} from "../controllers/sessionController.js";

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

export default router;
