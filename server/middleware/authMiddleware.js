const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify Google token
const verifyGoogleToken = async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub; // Google ID
    const email = payload.email; // User email
    const name = payload.name; // User name
    const picture = payload.picture; // Profile picture URL
    const locale = payload.locale; // User's locale

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

module.exports = { verifyGoogleToken };
