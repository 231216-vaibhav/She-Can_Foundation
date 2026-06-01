const mongoose = require('mongoose');

// Define Schema for She Can Foundation submissions
const submissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [5, 'Message must be at least 5 characters long'],
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export Model
module.exports = mongoose.model('Submission', submissionSchema);
