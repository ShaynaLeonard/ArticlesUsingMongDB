// Importing required modules
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interaction
const id_validator = require('mongoose-id-validator'); // Importing mongoose-id-validator for ObjectId validation
const Review = require('./review'); // Import the Review model

// name: validateArticleId
// description: checks that value received only contain numbers or letters 
// parameters: value (articleId)
// return value: boolean 
// Defining a custom validator function for the articleId field
function validateArticleId(value) {
    // Check if the value contains only numbers and letters
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(value);
}

// name: validateDate
// description: checks if the date recieved is in the correct format 
// parameters: value (date of publication)
// return value: boolean 
// Defining a custom validator function for the dateOfPublication field
function validateDate(value) {
    // Regular expression to match the format yyyy-mm-dd
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(value);
}


var ArticleSchema = new mongoose.Schema({
    // Article ID (combination of numbers and letters)
    articleId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validateArticleId,
            message: props => `${props.value} is not a valid articleId. ArticleId must contain only numbers and letters.`
        }
    },
    // Heading of the article
    heading: {
        type: String,
        required: true,
        trim: true
    },
    // Date of publication (string format)
    dateOfPublication: {
        type: String, // Keep it as a string
        required: true,
        validate: [
            {
                // Custom validator function to check if the date is not in the future
                validator: function(value) {
                    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in yyyy-mm-dd format
                    if (value > currentDate) {
                        return false; // Date is in the future
                    }
                    return true; // Date is valid
                },
                // Custom error message for date in the future
                message: props => `Date can't be in the future.`
            },
            {
                // Custom validator function to check if the date is in yyyy-mm-dd format
                validator: validateDate,
                // Custom error message for incorrect date format
                message: props => `Date is not in correct format. It should be yyyy-mm-dd.`
            }
        ]
    },
    // Article summary
    summary: {
        type: String,
        required: true,
        trim: true
    },
    // Author of the article - acts as the author id because the email is unique 
    email: {
        type: String,
        required: true,
        trim: true
    },
    // List of reviews about the article
    reviews: [Review.schema] // Embedding the Review schema directly within the Article schema
}, { timestamps: true });

// Applying mongoose-id-validator plugin for ObjectId validation
ArticleSchema.plugin(id_validator);

const Article = mongoose.model('Article', ArticleSchema);

// Exporting the Task model for use in other modules
module.exports = Article;
