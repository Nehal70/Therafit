import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    locale: {
        type: String,
    },
    profilePicture: {
        type: String, // URL or path to image
        default: '',
    },
    height: { 
        type: Number,
    }, //cm 
    weight: { 
        type: Number,
    }, // kg
    gender: { 
        type: String, enum: ['male', 'female'],
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
