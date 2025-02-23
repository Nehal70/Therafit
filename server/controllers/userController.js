import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable

// Register User
export const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, dateOfBirth } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists.' });

        // Create new user (password should be hashed in a real app)
        user = new User({
            email,
            password, // Store password as it is (consider hashing in production)
            firstName,
            lastName,
            dateOfBirth,
            profileSetup: false // Default false (first-time login)
        });

        await user.save();
        res.status(201).json({ message: '✅ Registration successful.', userId: user._id });
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ error: '❌ Server error.' });
    }
};

// Login User
export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log('Login attempt:', email);  // Check if we get the email

      const user = await User.findOne({ email });
      console.log('Fetched user:', user);
      if (!user || user.password !== password) {
          return res.status(400).json({ error: 'Invalid credentials.' });
      }

      const token = jwt.sign(
          { userId: user._id },
          JWT_SECRET,
          { expiresIn: '1h' }
      );

      const firstLogin = !(user.height && user.weight && user.gender);  
      res.json({ message: '✅ Login successful', token, firstLogin });
  } catch (error) {
      console.error('Error during login:', error);  // Log errors here
      res.status(500).json({ error: '❌ Server error.' });
  }
};


// View User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};



