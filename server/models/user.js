import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10); // Hash password
    this.updatedAt = new Date(); // Ensure `updatedAt` gets set when a new user is created
    next();
});

// Middleware to update `updatedAt` whenever the document is updated (not just created)
userSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = mongoose.model('User', userSchema);

// Export the User model
export default User;



