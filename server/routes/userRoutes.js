import express from 'express';
import authenticate from '../middleware/authMiddleware.js';
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protect profile routes with authentication middleware
router.get('/:userId', authenticate, getUserProfile);
router.put('/:userId', authenticate, updateUserProfile);
router.delete('/:userId', authenticate, deleteUser);

export default router;




