const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a User
const userSchema = new Schema({
    googleId: { type: String, required: true, unique: true }, // Google user ID
    email: { type: String, required: true, unique: true },    // User's email address
    name: { type: String, required: true },                   // User's full name
    picture: { type: String },                                // URL to user's profile picture
    accessToken: { type: String },                            // Store the access token if needed
    createdAt: { type: Date, default: Date.now },             // Timestamp for when the user was created
    updatedAt: { type: Date, default: Date.now }              // Timestamp for when the user was last updated
});

// Automatically update `updatedAt` field on save
userSchema.pre('save', function(next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;