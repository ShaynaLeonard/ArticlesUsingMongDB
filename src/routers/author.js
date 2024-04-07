const express = require('express')
const Author = require('../models/author')
const router = new express.Router()

// name:  createAuthor 
// description: Function to create an author
// parameters received: in the body are the details required to make an author (name, email, cellphone number and house number)
// parameters returned: appropriate status and/or message if input is incorrect 
const CreateAuthor = async (req, res) => {
    // Check if an author with the same email already exists
    const existingAuthor = await Author.findOne({ email: req.body.email });
    if (existingAuthor) {
        return res.status(400).send({ error: 'Email is already registered' });
    }

    // If no existing author with the same email, create a new author
    const author = new Author(req.body); // Create a new author instance with request body
    try {
        await author.save(); // Save the author to the database
        res.status(201).send(author); // Send success response with the created author
    } catch (error) {
        res.status(400).send(error); // Send error response for other errors
    }
};

// Route handler to create an author
router.post('/authors', async (req, res) => {
    CreateAuthor(req, res); // Call the CreateAuthor function with req and res
});



module.exports = router