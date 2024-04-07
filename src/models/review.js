const mongoose = require('mongoose')
const validator = require('validator')

// Define the schema for reviews
const ReviewSchema = new mongoose.Schema({
    // Heading of the review
    heading: {
        type: String, // Data type is String
        required: true, // Field is required
        trim: true // Trimming leading and trailing whitespace
    },
    // Content of the review
    content: {
        type: String, // Data type is String
        required: true, // Field is required
        trim: true // Trimming leading and trailing whitespace
    },
    // Number of likes
    likes: {
        type: Number, // Data type is Number
        required: true, // Field is required
        validate: {
            validator: function(value) {
                return value >= 0; // Validate that likes is not less than 0
            },
            message: 'Likes cannot be less than 0' // Custom error message
        }
    },
    // Number of dislikes
    dislikes: {
        type: Number, // Data type is Number
        required: true, // Field is required
        validate: {
            validator: function(value) {
                return value >= 0; // Validate that dislikes is not less than 0
            },
            message: 'Dislikes cannot be less than 0' // Custom error message
        }
    }
}, { timestamps: true }); // Enabling timestamps for createdAt and updatedAt fields

// Create the Review model from the schema
const Review = mongoose.model('Review', ReviewSchema);

// Export the Review model
module.exports = Review;
