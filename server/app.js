import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { verifyGoogleToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// ✅ CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',  // Front-end origin
  credentials: true,                // Allow credentials like cookies (if needed)
}));

// ✅ Middleware for JSON parsing
app.use(bodyParser.json());

// ✅ Google OAuth login route
app.post('/api/auth/google-login', verifyGoogleToken, (req, res) => {
  res.status(200).json({
    message: '✅ Authentication successful',
    user: req.user,
  });
});

export default app;
