import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { verifyGoogleToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());

// ✅ Add this route to respond to GET requests at the root
app.get('/', (req, res) => {
  res.send('✅ API is running.');
});

// ✅ Google login route
app.post('/api/auth/google-login', verifyGoogleToken, (req, res) => {
  res.status(200).json({
    message: '✅ Authentication successful',
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

