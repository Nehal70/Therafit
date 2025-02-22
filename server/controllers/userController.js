import User from '../models/user.js'; // ES module import

// Create or find a user (Google OAuth)
export const createUser = async (req, res) => {
  const { googleId, email, firstName, lastName, dateOfBirth, locale, profilePicture, height, weight, gender, accessToken, refreshToken } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ googleId });
    if (!user) {
      // If not, create a new user
      user = new User({
        googleId,
        email,
        firstName,
        lastName,
        dateOfBirth,
        locale,
        profilePicture,
        height,
        weight,
        gender,
        accessToken,
        refreshToken,
      });

      await user.save();
    }

    res.status(201).json(user); // Successfully created or found user
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// View User Profile (Read)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user); // Return the user profile
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update User Profile (Usually, height/weight, etc.)
export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    res.json(updatedUser); // Return the updated user profile
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a User (Delete Account)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' }); // Successfully deleted
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

