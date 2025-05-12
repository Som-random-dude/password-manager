// E:\password-manager\models\User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
    // Add other fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User; // Make sure you are exporting the model