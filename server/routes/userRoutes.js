import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// 📌 Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 📌 User profile routes
router.get('/:userId', getUserProfile);
router.put('/:userId', updateUserProfile);
router.delete('/:userId', deleteUser);

export default router;




