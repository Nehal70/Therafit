import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    locale: { type: String },
    profilePicture: { type: String, default: '' },
    height: { type: Number }, // cm 
    weight: { type: Number }, // kg
    gender: { type: String, enum: ['male', 'female'] },
    isVerified: { type: Boolean, default: false }, // New users need to verify their email
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Middleware removed. No password hashing now

// Create User model
const User = mongoose.model('User', userSchema);
export default User;
