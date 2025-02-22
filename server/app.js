import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use(bodyParser.json());

console.log('MongoDB URI:', process.env.MONGODB_URI);  // Check the URI value


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('✅ API is running.');
});

// Include user-related routes
app.use('/api/users', userRoutes);

// Export app for `server.js`
export default app;





