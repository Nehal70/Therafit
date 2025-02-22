import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { verifyGoogleToken } from './middleware/authMiddleware.js'; // ES module import
import userRoutes from './routes/userRoutes.js'; // ES module import for user routes

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('✅ API is running.');
});

// Google login route
app.post('/api/auth/google-login', verifyGoogleToken, (req, res) => {
  res.status(200).json({
    message: '✅ Authentication successful',
    user: req.user,
  });
});

// Include your user routes here (user-related endpoints)
app.use('/api/users', userRoutes); // This connects all user-related routes

// Export the app for use in server.js
export default app;



