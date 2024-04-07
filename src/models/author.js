const mongoose = require('mongoose')
const validator = require('validator')

var AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    cellPhoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                // Check if the phone number matches the format xxx-xxx-xxxx
                return /^\d{3}-\d{3}-\d{4}$/.test(value);
            },
            message: props => `${props.value} is not a valid phone number format. Use xxx-xxx-xxxx format.`
        }
    },
    houseNumber: {
        type: Number,
    }
}, { timestamps: true }
);

const Author = mongoose.model('Author', AuthorSchema);

module.exports = Author