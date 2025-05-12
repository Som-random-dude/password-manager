const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        timestamps: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        timestamps: true
    },
    password: {
        type: String,
        required: true
    }
    // Add other fields as needed
})

//Define the User model
const user = mongoose.model('User', userSchema);

// Export the User model
module.exports = user; // Make sure you are exporting the modelno