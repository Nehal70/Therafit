import User from '../models/user.js';

// 📌 Register User (NO password hashing, NO email verification)
export const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists.' });

        user = new User({ email, password, firstName, lastName });
        await user.save();

        res.status(201).json({ message: '✅ Registration successful.', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: '❌ Server error.' });
    }
};

// 📌 Login User (NO password hashing)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        res.json({ message: '✅ Login successful', userId: user._id });
    } catch (error) {
        res.status(500).json({ error: '❌ Server error.' });
    }
};

// 📌 View User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

// 📌 Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// 📌 Delete User
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};


