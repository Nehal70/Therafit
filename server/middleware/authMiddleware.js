import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify Google token
const verifyGoogleToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: 'Token is required.' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, locale } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        googleId,
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        profilePicture: picture,
        locale,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await user.save();
    } else {
      user.profilePicture = picture;
      user.updatedAt = new Date();

      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export { verifyGoogleToken };

