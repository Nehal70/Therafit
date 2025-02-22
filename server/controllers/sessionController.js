import Session from '../models/session.js';
import User from '../models/user.js';

// Start a new session
export const startSession = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Create a new session and save it
        const session = new Session({
            userId: user._id,
        });

        await session.save();
        res.status(201).json({ message: 'Session started successfully', sessionId: session._id });
    } catch (error) {
        res.status(500).json({ error: 'Error starting session' });
    }
};

// Add a message to a session
export const addMessageToSession = async (req, res) => {
    try {
        const { sessionId, sender, text } = req.body;

        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        session.messages.push({ sender, text });
        await session.save();

        res.status(200).json({ message: 'Message added to session', session });
    } catch (error) {
        res.status(500).json({ error: 'Error adding message to session' });
    }
};

// Add an exercise to a session
export const addExerciseToSession = async (req, res) => {
    try {
        const { sessionId, name, description, duration, feedback } = req.body;

        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        const exercise = {
            name,
            description,
            duration,
            feedback,
        };

        session.workout.push(exercise);
        await session.save();

        res.status(200).json({ message: 'Exercise added to session', session });
    } catch (error) {
        res.status(500).json({ error: 'Error adding exercise to session' });
    }
};

// View a session (Read a session)
export const getSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId).populate('userId', 'firstName lastName');
        if (!session) return res.status(404).json({ error: 'Session not found' });

        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching session' });
    }
};

// Update a session (add messages or exercises)
export const updateSession = async (req, res) => {
    try {
        const { sessionId, messages, workout } = req.body;

        const session = await Session.findById(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        // Update the session with new messages or exercises
        if (messages) {
            session.messages.push(...messages);
        }
        if (workout) {
            session.workout.push(...workout);
        }

        session.updatedAt = new Date(); // Set updatedAt when modified
        await session.save();

        res.status(200).json({ message: 'Session updated successfully', session });
    } catch (error) {
        res.status(500).json({ error: 'Error updating session' });
    }
};

// Delete a session
export const deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found' });

        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting session' });
    }
};
