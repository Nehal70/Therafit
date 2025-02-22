import express from 'express';
import { createUser, getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';
const router = express.Router();

//Post request to create a new user
router.post('/create', createUser);

//Get request to view user's profile
router.get('/:userId', getUserProfile);

//Put request to update a user's profile
router.put('/:userId', updateUserProfile);

//Delete request to delete account
router.delete('/:userId', deleteUser);

export default router;

